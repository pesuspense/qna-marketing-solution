import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('관리자 문의 조회 API 시작');
    
    // 데이터베이스에서 문의 데이터 조회
    const quizResponses = await prisma.quizResponse.findMany({
      where: {
        hasInquiry: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`데이터베이스에서 ${quizResponses.length}개의 문의를 발견했습니다.`);

    // 응답 형식 변환 (answers를 문자열로 변환)
    const inquiries = quizResponses.map(response => ({
      id: response.id,
      timestamp: response.createdAt.toISOString(),
      name: response.name,
      phone: response.phone,
      clinicName: response.clinicName,
      email: response.email,
      recommendedSolution: response.recommendedSolution,
      answers: JSON.stringify(response.answers) // JSON을 문자열로 변환
    }));

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