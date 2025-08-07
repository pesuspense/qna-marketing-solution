import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // 데이터베이스에 저장
    try {
      console.log('🗄️ 데이터베이스에 저장 시도...');
      
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

      console.log('✅ 데이터베이스 저장 성공:', quizResponse.id);
      
      return NextResponse.json(
        { 
          success: true, 
          message: '상담 문의가 성공적으로 접수되었습니다.',
          id: quizResponse.id,
          savedTo: 'database'
        },
        { status: 201 }
      );

    } catch (dbError) {
      console.error('❌ 데이터베이스 저장 오류:', dbError);
      
      return NextResponse.json(
        { 
          error: '데이터베이스 저장 중 오류가 발생했습니다.',
          details: dbError instanceof Error ? dbError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

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