'use client';

import { MarketingSolution } from '@/types/quiz';
import { CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SolutionResultProps {
  solution: MarketingSolution;
  onInquiry: (name: string, phone: string, clinicName: string, email: string) => void;
}

export default function SolutionResult({ solution, onInquiry }: SolutionResultProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  // 전화번호 정규식 검증 (000-0000-0000 형식)
  const validatePhone = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  // 이메일 정규식 검증
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, '');
    
    // 최대 11자리까지만 허용 (000-0000-0000 형식)
    const limitedNumbers = numbers.slice(0, 11);
    
    // 자동으로 하이픈 추가
    let formattedValue = '';
    if (limitedNumbers.length <= 3) {
      formattedValue = limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      formattedValue = `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      formattedValue = `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
    }
    
    setPhone(formattedValue);
    
    // 실시간 검증
    if (formattedValue && !validatePhone(formattedValue)) {
      setPhoneError('000-0000-0000 형식으로 입력해주세요.');
    } else {
      setPhoneError('');
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !clinicName.trim() || !email.trim()) {
      setErrorMessage('모든 필드를 입력해주세요.');
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError('올바른 전화번호 형식을 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    setPhoneError('');
    setEmailError('');
    
    try {
      await onInquiry(name, phone, clinicName, email);
      alert('상담 문의가 성공적으로 접수되었습니다!');
      // 성공 후 메인페이지로 이동
      router.push('/');
    } catch (error) {
      console.error('상담 문의 오류:', error);
      let message = '상담 문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.';
      
      if (error instanceof Error) {
        message = error.message;
      }
      
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🦷 맞춤형 치과 마케팅 솔루션
        </h1>
        <p className="text-lg text-gray-600">
          귀하의 답변을 바탕으로 최적의 치과 마케팅 솔루션을 추천드립니다.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {solution.name}
          </h2>
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {solution.category}
          </span>
        </div>
        
        <p className="text-lg text-gray-700 text-center mb-6 leading-relaxed">
          {solution.description}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-800">예상 비용</p>
              <p className="text-gray-600">{solution.estimatedCost}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-800">소요 기간</p>
              <p className="text-gray-600">{solution.timeline}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-medium text-gray-800">예상 효과</p>
              <p className="text-gray-600">단계적 성과 향상</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
            주요 혜택
          </h3>
          <ul className="space-y-3">
            {solution.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          📞 상담 문의하기
        </h3>
        <p className="text-gray-600 text-center mb-6">
          더 자세한 상담을 원하시면 아래 정보를 입력해주세요.
        </p>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름 *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
              placeholder="이름을 입력해주세요"
            />
          </div>
          
          <div>
            <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-2">
              치과명 *
            </label>
            <input
              type="text"
              id="clinicName"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
              placeholder="치과명을 입력해주세요"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              연락처 *
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
              placeholder="000-0000-0000"
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일 *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
              placeholder="이메일을 입력해주세요"
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !phone.trim() || !clinicName.trim() || !email.trim() || !validatePhone(phone) || !validateEmail(email)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '처리 중...' : '상담 문의하기'}
          </button>
        </form>
      </div>
    </div>
  );
} 