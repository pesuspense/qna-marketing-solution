import { QuizAnswer, MarketingSolution } from '@/types/quiz';
import { marketingSolutions } from '@/data/quiz-data';

// 조건별 가중치 정의
const CONDITION_WEIGHTS: { [key: string]: number } = {
  // 예산 관련 (핵심 가중치)
  'high': 2,
  'veryHigh': 2,
  
  // 성과 중심 전략 (핵심 가중치)
  'conversion': 2,
  'optimization': 2,
  
  // 방향성 관련 (중요 가중치)
  'strategy': 1.5,
  'positioning': 1.5,
  
  // 운영 관련 (중간 가중치)
  'resources': 1,
  'branding': 1,
  'content': 1,
  
  // 채널 특성 (기본 가중치)
  'sns': 0.5,
  'agency': 0.5,
  'referral': 0.5,
  'none': 0.5,
  
  // 진료 영역 (기본 가중치)
  'basic': 0.5,
  'specialized': 0.5,
  'comprehensive': 0.5,
  'startup': 0.5,
  
  // 차별화 관련 (기본 가중치)
  'differentiation': 0.5
};

export function recommendSolution(answers: QuizAnswer[]): MarketingSolution {
  // 답변에서 값들을 추출 (다중 선택 답변 처리)
  const answerValues: string[] = [];
  answers.forEach(answer => {
    if (answer.answer.includes(',')) {
      // 다중 선택 답변인 경우 쉼표로 분리
      const multipleAnswers = answer.answer.split(',').map(v => v.trim());
      answerValues.push(...multipleAnswers);
    } else {
      answerValues.push(answer.answer);
    }
  });
  
  // 각 솔루션에 대한 점수 계산
  const solutionScores = marketingSolutions.map(solution => {
    let score = 0;
    let matchedConditions: string[] = [];
    
    // 조건과 답변을 비교하여 점수 계산
    solution.conditions.forEach(condition => {
      if (answerValues.includes(condition)) {
        // 기본 매칭 점수 (1점)
        score += 1;
        matchedConditions.push(condition);
        
        // 가중치 점수 추가
        const weight = CONDITION_WEIGHTS[condition] || 0;
        score += weight;
      }
    });
    
    return {
      solution,
      score,
      matchedConditions,
      baseScore: matchedConditions.length, // 기본 매칭 점수
      weightScore: score - matchedConditions.length // 가중치 점수
    };
  });
  
  // 점수가 높은 순으로 정렬
  solutionScores.sort((a, b) => b.score - a.score);
  
  // 디버깅용 로그 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.log('User answers:', answerValues);
    console.log('Solution scores:', solutionScores.map(s => ({
      name: s.solution.name,
      totalScore: s.score,
      baseScore: s.baseScore,
      weightScore: s.weightScore,
      matchedConditions: s.matchedConditions
    })));
  }
  
  // 가장 높은 점수의 솔루션 반환
  return solutionScores[0].solution;
}

export function getSolutionById(id: string): MarketingSolution | undefined {
  return marketingSolutions.find(solution => solution.id === id);
} 