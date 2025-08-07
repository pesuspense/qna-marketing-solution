import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, name, phone, clinicName, email, recommendedSolution } = body;

    console.log('Received inquiry data:', { answers, name, phone, clinicName, email, recommendedSolution });

    // 데이터 유효성 검사
    if (!answers || !name || !phone || !clinicName || !email || !recommendedSolution) {
      console.error('Missing required fields:', { answers: !!answers, name: !!name, phone: !!phone, clinicName: !!clinicName, email: !!email, recommendedSolution: !!recommendedSolution });
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    let savedToDatabase = false;
    let savedToCSV = false;

    // 1. 데이터베이스에 저장 시도
    try {
      console.log('데이터베이스에 저장 시도');
      await prisma.$connect();
      
      const quizResponse = await prisma.quizResponse.create({
        data: {
          answers: answers,
          name: name,
          phone: phone,
          clinicName: clinicName,
          email: email,
          recommendedSolution: recommendedSolution,
          hasInquiry: true
        }
      });

      console.log('Inquiry saved successfully to database:', quizResponse.id);
      savedToDatabase = true;

    } catch (dbError) {
      console.error('데이터베이스 저장 오류:', dbError);
    } finally {
      await prisma.$disconnect();
    }

    // 2. 데이터베이스 저장 실패 시 CSV 파일에 저장 시도
    if (!savedToDatabase) {
      try {
        console.log('CSV 파일에 저장 시도');
        
        // 데이터 저장 디렉토리 생성
        const dataDir = join(process.cwd(), 'data');
        if (!existsSync(dataDir)) {
          mkdirSync(dataDir, { recursive: true });
        }

        // CSV 파일에 데이터 저장
        const csvFile = join(dataDir, 'inquiries.csv');
        const timestamp = new Date().toISOString();
        
        // JSON 데이터를 안전하게 문자열로 변환
        let answersString;
        try {
          if (Array.isArray(answers)) {
            answersString = JSON.stringify(answers);
          } else {
            answersString = JSON.stringify([answers]);
          }
        } catch (jsonError) {
          console.error('JSON 변환 오류:', jsonError);
          answersString = JSON.stringify([{ error: 'JSON 변환 실패', originalData: answers }]);
        }

        // CSV 라인 생성 (따옴표 이스케이프 처리)
        const csvLine = `${timestamp},"${name.replace(/"/g, '""')}","${phone.replace(/"/g, '""')}","${clinicName.replace(/"/g, '""')}","${email.replace(/"/g, '""')}","${recommendedSolution.replace(/"/g, '""')}","${answersString.replace(/"/g, '""')}"\n`;
        
        if (!existsSync(csvFile)) {
          // 헤더 추가
          const header = 'timestamp,name,phone,clinicName,email,recommendedSolution,answers\n';
          writeFileSync(csvFile, header);
        }
        
        appendFileSync(csvFile, csvLine);
        console.log('Inquiry saved successfully to CSV file');
        savedToCSV = true;

      } catch (csvError) {
        console.error('CSV 파일 저장 오류:', csvError);
      }
    }

    // 3. 저장 결과 로깅
    if (savedToDatabase) {
      console.log('상담 문의가 데이터베이스에 성공적으로 저장되었습니다.');
    } else if (savedToCSV) {
      console.log('상담 문의가 CSV 파일에 성공적으로 저장되었습니다.');
    } else {
      console.log('상담 문의 저장 실패 - 로그만 기록:', {
        timestamp: new Date().toISOString(),
        name,
        phone,
        clinicName,
        email,
        recommendedSolution,
        answers
      });
    }

    return NextResponse.json(
      { 
        success: true, 
        message: '상담 문의가 성공적으로 접수되었습니다.',
        id: new Date().toISOString(),
        savedTo: savedToDatabase ? 'database' : savedToCSV ? 'csv' : 'log'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('상담 문의 처리 중 오류:', error);
    
    let errorMessage = '서버 오류가 발생했습니다. 다시 시도해주세요.';
    
    if (error instanceof Error) {
      if (error.message.includes('DATABASE_URL')) {
        errorMessage = '데이터베이스 설정 오류가 발생했습니다.';
      } else if (error.message.includes('connect')) {
        errorMessage = '데이터베이스 연결 오류가 발생했습니다.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 