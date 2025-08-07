import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    console.log('관리자 문의 조회 API 시작');
    
    const csvFile = join(process.cwd(), 'data', 'inquiries.csv');
    
    if (!existsSync(csvFile)) {
      console.log('CSV 파일이 존재하지 않습니다.');
      return NextResponse.json({ inquiries: [] });
    }

    const csvContent = readFileSync(csvFile, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    if (lines.length <= 1) {
      console.log('CSV 파일에 데이터가 없습니다.');
      return NextResponse.json({ inquiries: [] });
    }

    // 헤더 제거하고 데이터만 파싱
    const dataLines = lines.slice(1);
    const inquiries = [];

    console.log(`CSV 파일에서 ${dataLines.length}개의 레코드를 발견했습니다.`);

    for (const line of dataLines) {
      try {
        // CSV 파싱 (쉼표로 구분, 따옴표 처리)
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < 7) {
          console.log(`라인 파싱 실패: ${line.substring(0, 50)}...`);
          continue;
        }
        
        const [timestamp, name, phone, clinicName, email, recommendedSolution, answers] = matches.map(field => 
          field.replace(/^"|"$/g, '') // 따옴표 제거
        );
        
        inquiries.push({
          timestamp,
          name,
          phone,
          clinicName,
          email,
          recommendedSolution,
          answers
        });
      } catch (lineError) {
        console.error('라인 파싱 오류:', lineError);
        continue;
      }
    }

    // 시간순으로 정렬 (최신이 먼저)
    inquiries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    console.log(`성공적으로 파싱된 문의 수: ${inquiries.length}`);
    console.log('관리자 문의 조회 API 완료');
    
    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('관리자 API 오류:', error);
    
    let errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 