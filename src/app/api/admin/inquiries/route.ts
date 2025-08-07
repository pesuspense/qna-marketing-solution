import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

interface InquiryData {
  timestamp: string;
  name: string;
  phone: string;
  clinicName: string;
  email: string;
  recommendedSolution: string;
  answers: string;
}

export async function GET() {
  try {
    console.log('관리자 문의 조회 API 시작');
    
    let inquiries: InquiryData[] = [];
    
    // 먼저 데이터베이스에서 시도
    try {
      console.log('데이터베이스에서 조회 시도');
      await prisma.$connect();
      
      const quizResponses = await prisma.quizResponse.findMany({
        where: {
          hasInquiry: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log(`데이터베이스에서 조회된 상담 문의 수: ${quizResponses.length}`);

      inquiries = quizResponses.map(response => ({
        timestamp: response.createdAt.toISOString(),
        name: response.name,
        phone: response.phone,
        clinicName: response.clinicName || '',
        email: response.email || '',
        recommendedSolution: response.recommendedSolution,
        answers: JSON.stringify(response.answers)
      }));
      
    } catch (dbError) {
      console.error('데이터베이스 조회 실패:', dbError);
      
      // 데이터베이스 실패 시 CSV 파일에서 시도
      try {
        console.log('CSV 파일에서 조회 시도');
        const csvFile = join(process.cwd(), 'data', 'inquiries.csv');
        
        if (existsSync(csvFile)) {
          const csvContent = readFileSync(csvFile, 'utf-8');
          const lines = csvContent.trim().split('\n');
          
          if (lines.length > 1) {
            const dataLines = lines.slice(1);
            
            for (const line of dataLines) {
              try {
                const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                if (!matches || matches.length < 7) continue;
                
                const [timestamp, name, phone, clinicName, email, recommendedSolution, answers] = matches.map(field => 
                  field.replace(/^"|"$/g, '')
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
                console.error('CSV 라인 파싱 오류:', lineError);
                continue;
              }
            }
          }
        }
        
        console.log(`CSV 파일에서 조회된 상담 문의 수: ${inquiries.length}`);
        
      } catch (csvError) {
        console.error('CSV 파일 조회 실패:', csvError);
      }
    } finally {
      await prisma.$disconnect();
    }

    console.log('관리자 문의 조회 API 완료');
    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('관리자 API 오류:', error);
    
    let errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.';
    
    if (error instanceof Error) {
      console.error('오류 상세 정보:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      if (error.message.includes('DATABASE_URL')) {
        errorMessage = '데이터베이스 설정 오류가 발생했습니다.';
      } else if (error.message.includes('connect')) {
        errorMessage = '데이터베이스 연결 오류가 발생했습니다.';
      } else if (error.message.includes('no such table')) {
        errorMessage = '데이터베이스 테이블이 존재하지 않습니다.';
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