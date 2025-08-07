'use client';

import { Question, QuizAnswer } from '@/types/quiz';
import { useState, useEffect } from 'react';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: QuizAnswer) => void;
  currentAnswer?: string;
}

export default function QuizQuestion({ question, onAnswer, currentAnswer }: QuizQuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // 질문이 변경될 때 선택된 옵션 초기화
  useEffect(() => {
    setSelectedOptions([]);
  }, [question.id]);



  const handleOptionSelect = (optionValue: string) => {
    if (question.allowMultiple) {
      // 중복 선택 가능한 경우
      const newSelectedOptions = selectedOptions.includes(optionValue)
        ? selectedOptions.filter(opt => opt !== optionValue)
        : [...selectedOptions, optionValue];
      
      setSelectedOptions(newSelectedOptions);
      
      // 여러 답변을 쉼표로 구분하여 전송
      onAnswer({
        questionId: question.id,
        answer: newSelectedOptions.join(',')
      });
    } else {
      // 단일 선택인 경우 - 선택 효과 추가
      setSelectedOptions([optionValue]);
      
      // 선택된 버튼에 시각적 피드백
      const button = document.querySelector(`[data-option="${optionValue}"]`) as HTMLElement;
      if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);
      }
      
      onAnswer({
        questionId: question.id,
        answer: optionValue
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          질문 {question.id}
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          {question.text}
        </p>
      </div>
      
      <div className="space-y-4">
        {question.options.map((option) => (
          <button
            key={option.id}
            data-option={option.value}
            onClick={() => handleOptionSelect(option.value)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
              (selectedOptions.includes(option.value) || currentAnswer === option.value || (currentAnswer && currentAnswer.includes(option.value)))
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900 font-medium'
            }`}
          >
            <span className="font-medium">{option.text}</span>
          </button>
        ))}
      </div>
      

    </div>
  );
} 