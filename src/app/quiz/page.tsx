'use client';

import { useState } from 'react';
import { questions } from '@/data/quiz-data';
import { recommendSolution } from '@/utils/solution-recommender';
import { QuizAnswer, MarketingSolution } from '@/types/quiz';
import QuizQuestion from '@/components/QuizQuestion';
import SolutionResult from '@/components/SolutionResult';
import ProgressBar from '@/components/ProgressBar';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedSolution, setRecommendedSolution] = useState<MarketingSolution | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (answer: QuizAnswer) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === answer.questionId);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = answer;
    } else {
      newAnswers.push(answer);
    }
    
    setAnswers(newAnswers);
    
    // 질문 4번(중복 선택 가능한 질문)이 아닌 경우에만 자동으로 다음 질문으로 이동
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion?.allowMultiple) {
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsTransitioning(false);
          }, 300); // fade out 후 질문 변경
        } else {
          // 마지막 질문인 경우 결과 페이지로 이동
          setIsLoading(true);
          
          // 4초 후에 결과 표시
          setTimeout(() => {
            const solution = recommendSolution(newAnswers);
            setRecommendedSolution(solution);
            setShowResult(true);
            setIsLoading(false);
          }, 4000);
        }
      }, 300); // 0.3초 후 자동 이동
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 모든 질문이 완료되면 로딩 시작
      setIsLoading(true);
      
      // 4초 후에 결과 표시
      setTimeout(() => {
        const solution = recommendSolution(answers);
        setRecommendedSolution(solution);
        setShowResult(true);
        setIsLoading(false);
      }, 4000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleInquiry = async (name: string, phone: string, clinicName: string, email: string) => {
    if (!recommendedSolution) return;

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers,
          name: name,
          phone: phone,
          clinicName: clinicName,
          email: email,
          recommendedSolution: recommendedSolution.name
        }),
      });

      if (!response.ok) {
        throw new Error('상담 문의 처리 중 오류가 발생했습니다.');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('상담 문의 오류:', error);
      throw error;
    }
  };

  const currentAnswer = answers.find(a => a.questionId === questions[currentQuestionIndex]?.id)?.answer;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* 헤더 */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center sm:text-left hover:text-blue-600 transition-colors">
                🦷 치과 마케팅 솔루션 추천
              </Link>
              <nav className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-sm sm:text-base">
                <Link href="/quiz" className="text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap">
                  AI 솔루션 진단
                </Link>
                <Link href="/admin/login" className="text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap">
                  관리자
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 pt-28 sm:pt-24 pb-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            {/* 로봇 이미지 */}
            <div className="mb-8">
              <div className="text-8xl mb-4 animate-bounce">
                🤖
              </div>
            </div>
            
            {/* 로딩 메시지 */}
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              AI가 진단중입니다
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              귀하의 답변을 분석하여 최적의 치과 마케팅 솔루션을 찾고 있습니다.
            </p>
            
            {/* 로딩 애니메이션 */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            
            {/* 진행 상태 표시 */}
            <div className="mt-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>답변 분석 완료</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>AI 솔루션 추천 중...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResult && recommendedSolution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* 헤더 */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center sm:text-left hover:text-blue-600 transition-colors">
                🦷 치과 마케팅 솔루션 추천
              </Link>
              <nav className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-sm sm:text-base">
                <Link href="/quiz" className="text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap">
                  AI 솔루션 진단
                </Link>
                <Link href="/admin/login" className="text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap">
                  관리자
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 pt-28 sm:pt-24 pb-8">
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Link>
          </div>
          <SolutionResult 
            solution={recommendedSolution} 
            onInquiry={handleInquiry}
          />
        </div>
      </div>
    );
  }

  return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* 헤더 */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center sm:text-left hover:text-blue-600 transition-colors">
                🦷 치과 마케팅 솔루션 추천
              </Link>
              <nav className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-sm sm:text-base">
                <Link href="/quiz" className="text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap">
                  AI 솔루션 진단
                </Link>
              </nav>
            </div>
          </div>
        </header>

      <div className="container mx-auto px-4 pt-28 sm:pt-24 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🦷 치과 마케팅 솔루션 추천 퀴즈
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            간단한 질문에 답하시면 귀하의 치과에 최적화된 마케팅 솔루션을 추천해드립니다.
          </p>
        </div>

        {/* 진행률 바 */}
        <div className={`transition-all duration-300 ease-in-out ${
          isTransitioning ? 'opacity-50' : 'opacity-100'
        }`}>
          <ProgressBar 
            currentStep={currentQuestionIndex + 1} 
            totalSteps={questions.length} 
          />
        </div>

        {/* 질문 */}
        <div className={`transition-all duration-300 ease-in-out ${
          isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}>
          <QuizQuestion
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            currentAnswer={currentAnswer}
          />
        </div>

        {/* 네비게이션 버튼 */}
        <div className="max-w-2xl mx-auto mt-8 flex justify-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 질문
          </button>
          
          {/* 질문 4번(중복 선택 가능한 질문)에서만 다음 버튼 표시 */}
          {questions[currentQuestionIndex]?.allowMultiple && (
            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              다음 질문
            </button>
          )}
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 