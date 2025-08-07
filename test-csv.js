const { writeFileSync, appendFileSync, existsSync, mkdirSync, readFileSync } = require('fs');
const { join } = require('path');

async function testCSVStorage() {
  try {
    console.log('=== CSV 파일 저장 테스트 ===\n');
    
    // 테스트 데이터
    const testData = {
      answers: [
        { questionId: 1, answer: "basic" },
        { questionId: 2, answer: "sns" },
        { questionId: 3, answer: "high" },
        { questionId: 4, answer: "high,differentiation,conversion" },
        { questionId: 5, answer: "positioning" }
      ],
      name: "CSV 테스트 사용자",
      phone: "010-9999-8888",
      clinicName: "CSV 테스트 치과",
      email: "csv-test@example.com",
      recommendedSolution: "치과 맞춤형 마케팅 전략"
    };
    
    console.log('📝 테스트 데이터:', testData);
    
    // 데이터 저장 디렉토리 생성
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
      console.log('📁 데이터 디렉토리 생성');
    }

    // CSV 파일에 데이터 저장
    const csvFile = join(dataDir, 'inquiries.csv');
    const timestamp = new Date().toISOString();
    
    // JSON 데이터를 안전하게 문자열로 변환
    let answersString;
    try {
      if (Array.isArray(testData.answers)) {
        answersString = JSON.stringify(testData.answers);
      } else {
        answersString = JSON.stringify([testData.answers]);
      }
    } catch (jsonError) {
      console.error('❌ JSON 변환 오류:', jsonError);
      answersString = JSON.stringify([{ error: 'JSON 변환 실패', originalData: testData.answers }]);
    }

    // CSV 라인 생성 (따옴표 이스케이프 처리)
    const csvLine = `${timestamp},"${testData.name.replace(/"/g, '""')}","${testData.phone.replace(/"/g, '""')}","${testData.clinicName.replace(/"/g, '""')}","${testData.email.replace(/"/g, '""')}","${testData.recommendedSolution.replace(/"/g, '""')}","${answersString.replace(/"/g, '""')}"\n`;
    
    if (!existsSync(csvFile)) {
      // 헤더 추가
      const header = 'timestamp,name,phone,clinicName,email,recommendedSolution,answers\n';
      writeFileSync(csvFile, header);
      console.log('📄 CSV 파일 헤더 생성');
    }
    
    // 저장 전 레코드 수 확인
    const beforeContent = readFileSync(csvFile, 'utf-8');
    const beforeLines = beforeContent.trim().split('\n');
    console.log(`📊 저장 전 레코드 수: ${beforeLines.length - 1}개`);
    
    // 새 데이터 추가
    appendFileSync(csvFile, csvLine);
    console.log('✅ CSV 파일 저장 성공');
    
    // 저장 후 레코드 수 확인
    const afterContent = readFileSync(csvFile, 'utf-8');
    const afterLines = afterContent.trim().split('\n');
    console.log(`📊 저장 후 레코드 수: ${afterLines.length - 1}개`);
    
    // 마지막 라인 확인
    const lastLine = afterLines[afterLines.length - 1];
    console.log('\n📝 마지막 저장된 라인:');
    console.log(lastLine.substring(0, 100) + '...');
    
    // 파싱 테스트
    try {
      const matches = lastLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      if (matches && matches.length >= 7) {
        const [timestamp, name, phone, clinicName, email, recommendedSolution, answers] = matches.map(field => 
          field.replace(/^"|"$/g, '')
        );
        
        console.log('\n✅ 파싱 테스트 성공:');
        console.log(`   - 이름: ${name}`);
        console.log(`   - 치과명: ${clinicName}`);
        console.log(`   - 이메일: ${email}`);
        console.log(`   - 추천 솔루션: ${recommendedSolution}`);
      } else {
        console.log('\n❌ 파싱 테스트 실패');
      }
    } catch (parseError) {
      console.error('❌ 파싱 오류:', parseError);
    }
    
    console.log('\n🎉 CSV 파일 저장 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 테스트 중 오류:', error);
  }
}

testCSVStorage();
