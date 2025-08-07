const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('=== 데이터베이스 내용 확인 ===\n');
    
    // QuizResponse 테이블 확인
    const quizResponses = await prisma.quizResponse.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📊 QuizResponse 테이블 - 총 ${quizResponses.length}개 레코드`);
    console.log('='.repeat(50));
    
    if (quizResponses.length === 0) {
      console.log('❌ 데이터가 없습니다.');
    } else {
      quizResponses.forEach((response, index) => {
        console.log(`\n📝 레코드 ${index + 1}:`);
        console.log(`   ID: ${response.id}`);
        console.log(`   생성일: ${response.createdAt}`);
        console.log(`   이름: ${response.name}`);
        console.log(`   전화번호: ${response.phone}`);
        console.log(`   치과명: ${response.clinicName || 'N/A'}`);
        console.log(`   이메일: ${response.email || 'N/A'}`);
        console.log(`   추천 솔루션: ${response.recommendedSolution}`);
        console.log(`   상담 문의: ${response.hasInquiry ? '예' : '아니오'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ 데이터베이스 확인 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
