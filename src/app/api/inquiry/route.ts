import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('=== 상담 문의 API 시작 ===');
    
    const body = await request.json();
    const { answers, name, phone, clinicName, email, recommendedSolution } = body;

    console.log('📝 받은 데이터:', { 
      name, 
      phone, 
      clinicName, 
      email, 
      recommendedSolution,
      answersCount: Array.isArray(answers) ? answers.length : 'N/A'
    });

    // 데이터 유효성 검사
    if (!answers || !name || !phone || !clinicName || !email || !recommendedSolution) {
      console.error('❌ 필수 필드 누락:', { 
        answers: !!answers, 
        name: !!name, 
        phone: !!phone, 
        clinicName: !!clinicName, 
        email: !!email, 
        recommendedSolution: !!recommendedSolution 
      });
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    let savedToCSV = false;
    const timestamp = new Date().toISOString();

    // CSV 파일에 저장 시도
    try {
      console.log('📄 CSV 파일에 저장 시도...');
      
      // 데이터 저장 디렉토리 생성
      const dataDir = join(process.cwd(), 'data');
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true });
        console.log('📁 데이터 디렉토리 생성');
      }

      // CSV 파일에 데이터 저장
      const csvFile = join(dataDir, 'inquiries.csv');
      
      // JSON 데이터를 안전하게 문자열로 변환
      let answersString;
      try {
        if (Array.isArray(answers)) {
          answersString = JSON.stringify(answers);
        } else {
          answersString = JSON.stringify([answers]);
        }
      } catch (jsonError) {
        console.error('❌ JSON 변환 오류:', jsonError);
        answersString = JSON.stringify([{ error: 'JSON 변환 실패', originalData: answers }]);
      }

      // CSV 라인 생성 (따옴표 이스케이프 처리)
      const csvLine = `${timestamp},"${name.replace(/"/g, '""')}","${phone.replace(/"/g, '""')}","${clinicName.replace(/"/g, '""')}","${email.replace(/"/g, '""')}","${recommendedSolution.replace(/"/g, '""')}","${answersString.replace(/"/g, '""')}"\n`;
      
      if (!existsSync(csvFile)) {
        // 헤더 추가
        const header = 'timestamp,name,phone,clinicName,email,recommendedSolution,answers\n';
        writeFileSync(csvFile, header);
        console.log('📄 CSV 파일 헤더 생성');
      }
      
      appendFileSync(csvFile, csvLine);
      console.log('✅ CSV 파일 저장 성공');
      savedToCSV = true;

    } catch (csvError) {
      console.error('❌ CSV 파일 저장 오류:', csvError);
    }

    // 저장 결과 로깅 (Vercel 로그에서 확인 가능)
    console.log('📊 저장 결과 요약:');
    console.log(`   - CSV 파일: ${savedToCSV ? '✅ 성공' : '❌ 실패'}`);
    
    if (savedToCSV) {
      console.log('🎉 상담 문의가 CSV 파일에 성공적으로 저장되었습니다.');
    } else {
      console.log('⚠️ 상담 문의 저장 실패 - 로그만 기록');
    }

    // 항상 로그에 상담 문의 데이터 기록 (Vercel 로그에서 확인 가능)
    console.log('📝 상담 문의 데이터 (로그):', {
      timestamp,
      name,
      phone,
      clinicName,
      email,
      recommendedSolution,
      answers
    });

    console.log('=== 상담 문의 API 완료 ===\n');

    return NextResponse.json(
      { 
        success: true, 
        message: '상담 문의가 성공적으로 접수되었습니다.',
        id: timestamp,
        savedTo: savedToCSV ? 'csv' : 'log'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ 상담 문의 처리 중 오류:', error);
    
    let errorMessage = '서버 오류가 발생했습니다. 다시 시도해주세요.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 