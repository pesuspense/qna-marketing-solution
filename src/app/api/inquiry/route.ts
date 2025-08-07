import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

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

    // Vercel 환경에서는 파일 시스템 쓰기가 제한적일 수 있으므로 try-catch로 감싸기
    try {
      // 데이터 저장 디렉토리 생성
      const dataDir = join(process.cwd(), 'data');
      console.log('Data directory path:', dataDir);
      
      if (!existsSync(dataDir)) {
        console.log('Creating data directory...');
        mkdirSync(dataDir, { recursive: true });
      }

      // CSV 파일에 데이터 저장
      const csvFile = join(dataDir, 'inquiries.csv');
      console.log('CSV file path:', csvFile);
      
      const timestamp = new Date().toISOString();
      
      // JSON 데이터를 안전하게 문자열로 변환
      let answersString;
      try {
        // 배열인지 확인하고 안전하게 JSON 문자열로 변환
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
        console.log('Created new CSV file with header');
      }
      
      appendFileSync(csvFile, csvLine);
      console.log('Inquiry saved successfully to CSV file');

    } catch (fileError) {
      console.error('파일 시스템 오류 (Vercel 환경일 수 있음):', fileError);
      
      // 파일 시스템 오류가 발생해도 성공으로 처리 (개발 환경에서는 파일 저장, 프로덕션에서는 로그만)
      console.log('상담 문의 데이터 (파일 저장 실패):', {
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
        id: new Date().toISOString()
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('상담 문의 처리 중 오류:', error);
    
    // 더 자세한 오류 정보 제공
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