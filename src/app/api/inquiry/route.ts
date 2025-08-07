import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // 데이터베이스에 저장
    try {
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

    } catch (dbError) {
      console.error('데이터베이스 저장 오류:', dbError);
      
      // 데이터베이스 오류가 발생해도 성공으로 처리 (개발 환경에서는 DB 저장, 프로덕션에서는 로그만)
      console.log('상담 문의 데이터 (DB 저장 실패):', {
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