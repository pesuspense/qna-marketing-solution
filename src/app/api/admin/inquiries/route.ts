import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const csvFile = join(process.cwd(), 'data', 'inquiries.csv');
    
    if (!existsSync(csvFile)) {
      return NextResponse.json({ inquiries: [] });
    }

    const csvContent = readFileSync(csvFile, 'utf-8');
    
    // CSV 파일을 한 줄씩 읽어서 처리
    const lines = csvContent.trim().split('\n');
    
    if (lines.length <= 1) {
      return NextResponse.json({ inquiries: [] });
    }

    // 헤더 제거하고 데이터만 파싱
    const dataLines = lines.slice(1);
    const inquiries = [];

    for (const line of dataLines) {
      try {
        // CSV 파싱 (쉼표로 구분, 따옴표 처리)
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < 7) continue;
        
        const [timestamp, name, phone, clinicName, email, recommendedSolution, answers] = matches.map(field => 
          field.replace(/^"|"$/g, '') // 따옴표 제거
        );
        
        // JSON 파싱 시도 - 여러 방법으로 시도
        let parsedAnswers;
        try {
          // 1. 직접 JSON.parse 시도
          parsedAnswers = JSON.parse(answers);
        } catch (firstError) {
          try {
            // 2. 이스케이프된 따옴표 정리 후 다시 시도
            const cleanedAnswers = answers
              .replace(/\\"/g, '"')
              .replace(/^"|"$/g, '')
              .trim();
            parsedAnswers = JSON.parse(cleanedAnswers);
          } catch (secondError) {
            try {
              // 3. 정규식으로 답변 데이터 추출
              const answerMatches = answers.match(/"questionId":\s*(\d+),\s*"answer":\s*"([^"]+)"/g);
              if (answerMatches) {
                parsedAnswers = answerMatches.map(match => {
                  const questionIdMatch = match.match(/"questionId":\s*(\d+)/);
                  const answerMatch = match.match(/"answer":\s*"([^"]+)"/);
                  if (questionIdMatch && answerMatch) {
                    return {
                      questionId: parseInt(questionIdMatch[1]),
                      answer: answerMatch[1]
                    };
                  }
                  return null;
                }).filter(Boolean);
              } else {
                // 4. 마지막 수단으로 원본 문자열 반환
                parsedAnswers = answers;
              }
            } catch (thirdError) {
              console.error('JSON 파싱 실패:', thirdError, 'Raw answers:', answers);
              parsedAnswers = answers;
            }
          }
        }
        
        inquiries.push({
          timestamp,
          name,
          phone,
          clinicName,
          email,
          recommendedSolution,
          answers: typeof parsedAnswers === 'string' ? parsedAnswers : JSON.stringify(parsedAnswers)
        });
      } catch (lineError) {
        console.error('라인 파싱 오류:', lineError, 'Line:', line);
        continue;
      }
    }

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('관리자 API 오류:', error);
    return NextResponse.json(
      { error: '데이터를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 