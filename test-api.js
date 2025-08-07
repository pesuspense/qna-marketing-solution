async function testInquiryAPI() {
  try {
    console.log('=== 상담 문의 API 테스트 ===\n');
    
    const testData = {
      answers: [
        { questionId: 1, answer: "basic" },
        { questionId: 2, answer: "sns" },
        { questionId: 3, answer: "high" },
        { questionId: 4, answer: "high,differentiation,conversion" },
        { questionId: 5, answer: "positioning" }
      ],
      name: "API 테스트 사용자",
      phone: "010-7777-6666",
      clinicName: "API 테스트 치과",
      email: "api-test@example.com",
      recommendedSolution: "치과 맞춤형 마케팅 전략"
    };
    
    console.log('📝 테스트 데이터:', testData);
    
    const response = await fetch('http://localhost:3000/api/inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    
    console.log('\n📊 API 응답 결과:');
    console.log(`   상태 코드: ${response.status}`);
    console.log(`   성공 여부: ${result.success}`);
    console.log(`   메시지: ${result.message}`);
    console.log(`   저장 위치: ${result.savedTo}`);
    console.log(`   ID: ${result.id}`);
    
    if (response.ok) {
      console.log('\n✅ API 테스트 성공!');
      
      // 잠시 대기 후 관리자 API 테스트
      console.log('\n⏳ 3초 후 관리자 API 테스트...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 관리자 API 테스트
      console.log('\n=== 관리자 API 테스트 ===');
      const adminResponse = await fetch('http://localhost:3000/api/admin/inquiries');
      const adminResult = await adminResponse.json();
      
      console.log(`📊 관리자 API 응답:`);
      console.log(`   상태 코드: ${adminResponse.status}`);
      console.log(`   문의 수: ${adminResult.inquiries?.length || 0}개`);
      
      if (adminResult.inquiries && adminResult.inquiries.length > 0) {
        const latestInquiry = adminResult.inquiries[0];
        console.log(`\n📝 최신 문의:`);
        console.log(`   이름: ${latestInquiry.name}`);
        console.log(`   치과명: ${latestInquiry.clinicName}`);
        console.log(`   이메일: ${latestInquiry.email}`);
        console.log(`   추천 솔루션: ${latestInquiry.recommendedSolution}`);
        console.log(`   생성일: ${latestInquiry.timestamp}`);
      }
      
      if (adminResponse.ok) {
        console.log('\n✅ 관리자 API 테스트 성공!');
      } else {
        console.log('\n❌ 관리자 API 테스트 실패!');
      }
      
    } else {
      console.log('\n❌ API 테스트 실패!');
      console.log('오류:', result.error);
    }
    
  } catch (error) {
    console.error('❌ 테스트 중 오류:', error);
  }
}

testInquiryAPI();
