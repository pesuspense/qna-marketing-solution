'use client';

import Link from 'next/link';
import { ArrowRight, Target, Users, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);
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
                퀴즈 시작
              </Link>
              <Link href="/admin/login" className="text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap">
                관리자
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 pt-32 sm:pt-28 pb-16">
        {/* 히어로 섹션 */}
        <div 
          id="hero"
          data-animate
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible('hero') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            치과에 최적화된<br />
            <span className="text-blue-600">마케팅 솔루션</span>을 찾아보세요
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            간단한 질문에 답하시면 귀하의 치과 규모, 진료 분야, 예산에 맞는 
            최적의 마케팅 솔루션을 AI가 추천해드립니다.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            퀴즈 시작하기
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {/* 특징 섹션 */}
        <div 
          id="features"
          data-animate
          className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 ease-out delay-200 ${
            isVisible('features') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">치과 맞춤형 추천</h3>
            <p className="text-gray-600">
              치과의 진료 특성과 지역 환경을 고려한 최적의 마케팅 솔루션을 정확하게 추천합니다.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">전문 상담</h3>
            <p className="text-gray-600">
              치과 마케팅 전문가의 상세한 상담을 통해 구체적인 실행 방안을 제시합니다.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">성과 중심</h3>
            <p className="text-gray-600">
              치과 특화 데이터 분석을 통해 측정 가능한 마케팅 성과를 달성합니다.
            </p>
          </div>
        </div>

        {/* 솔루션 카테고리 */}
        <div 
          id="solutions"
          data-animate
          className={`bg-white rounded-lg shadow-lg p-8 mb-16 transition-all duration-1000 ease-out delay-300 ${
            isVisible('solutions') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            제공하는 치과 마케팅 솔루션
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "치과 맞춤형 마케팅 전략",
                description: "진료 분야별 타겟 고객 분석 및 차별화 전략",
                icon: "🦷"
              },
              {
                title: "치과 콘텐츠 마케팅",
                description: "진료 사례 및 치료 과정 전문 콘텐츠",
                icon: "📝"
              },
              {
                title: "치과 성과 중심 광고",
                description: "지역 기반 정확한 타겟팅 및 최적화",
                icon: "🎯"
              },
              {
                title: "치과 소셜미디어 마케팅",
                description: "인스타그램, 블로그 활용 브랜드 마케팅",
                icon: "📱"
              },
              {
                title: "치과 데이터 분석",
                description: "고객 행동 분석 및 마케팅 성과 최적화",
                icon: "📊"
              },
              {
                title: "신규 치과 마케팅 패키지",
                description: "신규 개원 치과를 위한 기본 마케팅 인프라",
                icon: "🏥"
              }
            ].map((solution, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{solution.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{solution.title}</h3>
                <p className="text-gray-600 text-sm">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA 섹션 */}
        <div 
          id="cta"
          data-animate
          className={`text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-12 text-white transition-all duration-1000 ease-out delay-400 ${
            isVisible('cta') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 시작하세요!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            5분의 시간으로 귀하의 치과에 최적화된 마케팅 솔루션을 찾아보세요.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            무료 퀴즈 시작하기
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 치과 마케팅 솔루션 추천. 모든 권리 보유.
          </p>
        </div>
      </footer>
    </div>
  );
}
