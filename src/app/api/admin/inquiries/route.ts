import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 데이터베이스에서 상담 문의 데이터 조회
    const quizResponses = await prisma.quizResponse.findMany({
      where: {
        hasInquiry: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 관리자 페이지에서 사용할 형식으로 변환
    const inquiries = quizResponses.map(response => ({
      timestamp: response.createdAt.toISOString(),
      name: response.name,
      phone: response.phone,
      clinicName: response.clinicName,
      email: response.email,
      recommendedSolution: response.recommendedSolution,
      answers: JSON.stringify(response.answers)
    }));

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('관리자 API 오류:', error);
    return NextResponse.json(
      { error: '데이터를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 