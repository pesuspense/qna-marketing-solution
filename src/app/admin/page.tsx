'use client';

import { useState, useEffect } from 'react';
import { questions } from '@/data/quiz-data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Download, ChevronDown, ChevronUp } from 'lucide-react';
import * as XLSX from 'xlsx';

interface InquiryData {
  timestamp: string;
  name: string;
  phone: string;
  clinicName: string;
  email: string;
  recommendedSolution: string;
  answers: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // 로그인 상태 확인
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsAuthenticated(true);
      fetchInquiries();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/admin/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error('데이터 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const _formatAnswers = (answersStr: string) => {
    try {
      const answers = JSON.parse(answersStr);
      return answers.map((answer: { questionId: number; answer: string }) => {
        const question = questions.find(q => q.id === answer.questionId);
        const option = question?.options.find(opt => opt.value === answer.answer);
        
        if (question && option) {
          return `질문${question.id}: ${question.text}\n답변: ${option.text}`;
        } else {
          return `질문${answer.questionId}: ${answer.answer}`;
        }
      }).join('\n\n');
    } catch {
      return answersStr;
    }
  };

  const renderAnswers = (answersStr: string) => {
    // 빈 문자열 체크
    if (!answersStr || answersStr.trim() === '') {
      return (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          답변 데이터 없음
        </div>
      );
    }

    try {
      // JSON 파싱 시도 - 여러 방법으로 시도
      let answers;
      
      // 1. 직접 JSON.parse 시도
      try {
        const cleanStr = answersStr.trim();
        answers = JSON.parse(cleanStr);
      } catch {
        // 2. CSV 이스케이프 문제 해결 ("" -> ")
        try {
          const cleanedStr = answersStr
            .replace(/""/g, '"')  // CSV 이스케이프된 따옴표 정리
            .replace(/^"|"$/g, '') // 앞뒤 따옴표 제거
            .trim();
          answers = JSON.parse(cleanedStr);
        } catch {
          // 3. 일반 이스케이프 문제 해결
          try {
            const cleanedStr = answersStr
              .replace(/\\"/g, '"')  // 이스케이프된 따옴표 정리
              .replace(/^"|"$/g, '') // 앞뒤 따옴표 제거
              .trim();
            answers = JSON.parse(cleanedStr);
          } catch {
             // 4. 마지막으로 문자열을 직접 파싱 시도
             console.error('JSON 파싱 실패:', 'Raw data:', answersStr);
            
            // CSV 이스케이프된 문자열에서 직접 답변 추출 시도
            const answerMatches = answersStr.match(/""questionId"":\s*(\d+),\s*""answer"":\s*""([^""]+)""/g);
            if (answerMatches) {
              const parsedAnswers = answerMatches.map(match => {
                const questionIdMatch = match.match(/""questionId"":\s*(\d+)/);
                const answerMatch = match.match(/""answer"":\s*""([^""]+)""/);
                if (questionIdMatch && answerMatch) {
                  return {
                    questionId: parseInt(questionIdMatch[1]),
                    answer: answerMatch[1]
                  };
                }
                return null;
              }).filter(Boolean);
              
              if (parsedAnswers.length > 0) {
                answers = parsedAnswers;
              } else {
                throw new Error('답변 데이터 파싱 실패');
              }
            } else {
              // 일반 JSON 형식으로 다시 시도
              const normalAnswerMatches = answersStr.match(/"questionId":\s*(\d+),\s*"answer":\s*"([^"]+)"/g);
              if (normalAnswerMatches) {
                const parsedAnswers = normalAnswerMatches.map(match => {
                  const questionIdMatch = match.match(/"questionId":\s*(\d+)/);
                  const answerMatch = match.match(/"answer":\s*"([^"]+)"/);
                  if (questionIdMatch && answerMatch) {
                    return {
                      questionId: parseInt(questionIdMatch[1]),
                      answer: answerMatch[1]
                    };
                  }
                  return null;
                }).filter(Boolean);
                
                if (parsedAnswers.length > 0) {
                  answers = parsedAnswers;
                } else {
                  throw new Error('답변 데이터 파싱 실패');
                }
              } else {
                throw new Error('답변 데이터 파싱 실패');
              }
            }
          }
        }
      }

      // 배열이 아닌 경우 처리
      if (!Array.isArray(answers)) {
        return (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <div>잘못된 데이터 형식 (배열이 아님)</div>
            <div className="mt-1 text-xs break-all">{answersStr.substring(0, 100)}...</div>
          </div>
        );
      }
      
             return (
         <div className="space-y-2">
           {answers.map((answer: { questionId: number; answer: string }, index: number) => {
            if (!answer || typeof answer !== 'object') {
              return (
                <div key={index} className="border-l-4 border-gray-300 pl-3 py-1">
                  <div className="text-xs text-gray-500">
                    잘못된 답변 데이터
                  </div>
                </div>
              );
            }

                         const questionId = answer.questionId;
             const answerValue = answer.answer;
            
            if (!questionId || !answerValue) {
              return (
                <div key={index} className="border-l-4 border-gray-300 pl-3 py-1">
                  <div className="text-xs text-gray-500">
                    답변 데이터 형식 오류
                  </div>
                </div>
              );
            }

            const question = questions.find(q => q.id === questionId);
            
            // 4번 질문(다중 선택)의 경우 특별 처리
            if (questionId === 4 && question?.allowMultiple) {
              // 쉼표로 구분된 다중 답변 처리
              const answerValues = answerValue.split(',').map((v: string) => v.trim());
              const selectedOptions = answerValues.map((value: string) => 
                question.options.find(opt => opt.value === value)
              ).filter(Boolean);
              
              return (
                <div key={index} className="border-l-4 border-blue-500 pl-3 py-1">
                  {selectedOptions.map((option, optIndex: number) => (
                    <div key={optIndex} className="text-xs font-medium text-blue-600">
                      ✓ {option?.text}
                    </div>
                  ))}
                </div>
              );
            }
            
            // 일반 단일 선택 답변 처리
            const option = question?.options.find(opt => opt.value === answerValue);
            
            // "월 800만원 이상" 선택 시 빨간색 계열로 표시
            const isHighBudget = answerValue === "veryHigh" || option?.text?.includes("월 800만원 이상");
            const borderColor = isHighBudget ? "border-red-500" : "border-blue-500";
            const textColor = isHighBudget ? "text-red-600" : "text-blue-600";
            
            if (question && option) {
              return (
                <div key={index} className={`border-l-4 ${borderColor} pl-3 py-1`}>
                  <div className={`text-xs font-medium ${textColor}`}>
                    ✓ {option.text}
                  </div>
                </div>
              );
            } else {
              // 매칭 실패 시에도 value와 text를 표시
              const fallbackBorderColor = isHighBudget ? "border-red-300" : "border-gray-300";
              const fallbackTextColor = isHighBudget ? "text-red-600" : "text-gray-600";
              
              return (
                <div key={index} className={`border-l-4 ${fallbackBorderColor} pl-3 py-1`}>
                  <div className={`text-xs font-medium ${fallbackTextColor}`}>
                    선택된 답변: {answerValue}
                  </div>
                  {option && (
                    <div className={`text-xs ${textColor}`}>
                      ✓ {option.text}
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      );
    } catch (error) {
      console.error('Error rendering answers:', error);
      return (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div>데이터 표시 오류</div>
          <div className="mt-1 text-xs break-all">{answersStr.substring(0, 100)}...</div>
          <div className="mt-2 text-xs">
            <strong>원본 데이터:</strong> {answersStr}
          </div>
        </div>
      );
    }
  };

  const formatDate = (timestamp: string, isMobile: boolean = false) => {
    const date = new Date(timestamp);
    if (isMobile) {
      // 모바일에서는 년, 월, 일만 표시
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
    return date.toLocaleString('ko-KR');
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // 최신순 정렬 및 페이징 관련 계산
  const sortedInquiries = [...inquiries].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const totalPages = Math.ceil(sortedInquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInquiries = sortedInquiries.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedItems(new Set()); // 페이지 변경 시 확장된 항목 초기화
  };

  const downloadExcel = () => {
    if (inquiries.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }

    // 엑셀용 데이터 준비 (최신순 정렬)
    const sortedInquiriesForExcel = [...inquiries].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
         const excelData = sortedInquiriesForExcel.map((inquiry, index) => {
       // 답변 데이터 파싱 및 포맷팅
       let formattedAnswers = '';
       try {
         const answers = JSON.parse(inquiry.answers.replace(/""/g, '"'));
         formattedAnswers = answers.map((answer: { questionId: number; answer: string }) => {
          const question = questions.find(q => q.id === answer.questionId);
          const option = question?.options.find(opt => opt.value === answer.answer);
          return `질문${answer.questionId}: ${option?.text || answer.answer}`;
        }).join('\n');
      } catch {
        formattedAnswers = inquiry.answers;
      }

      return {
        '번호': index + 1,
        '접수일시': formatDate(inquiry.timestamp),
        '이름': inquiry.name,
        '치과명': inquiry.clinicName,
        '연락처': inquiry.phone,
        '이메일': inquiry.email,
        '추천 솔루션': inquiry.recommendedSolution,
        '퀴즈 답변': formattedAnswers
      };
    });

    // 워크북 생성
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // 컬럼 너비 자동 조정
    const colWidths = [
      { wch: 5 },   // 번호
      { wch: 20 },  // 접수일시
      { wch: 10 },  // 이름
      { wch: 15 },  // 치과명
      { wch: 15 },  // 연락처
      { wch: 25 },  // 이메일
      { wch: 20 },  // 추천 솔루션
      { wch: 50 }   // 퀴즈 답변
    ];
    ws['!cols'] = colWidths;

    // 워크시트를 워크북에 추가
    XLSX.utils.book_append_sheet(wb, ws, '치과마케팅문의');

    // 파일명 생성 (현재 날짜 포함)
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const fileName = `치과마케팅문의_${dateStr}.xlsx`;

    // 엑셀 파일 다운로드
    XLSX.writeFile(wb, fileName);
  };

  // 로그인하지 않은 경우 로딩 표시
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                         <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center sm:text-left hover:text-blue-600 transition-colors">
               🦷 치과 마케팅 솔루션
             </Link>
             <nav className="flex flex-wrap justify-center sm:justify-end items-center space-x-4 sm:space-x-6 text-sm sm:text-base">
              <Link href="/quiz" className="text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap">
                퀴즈 시작
              </Link>
              <Link href="/admin" className="text-blue-600 font-medium whitespace-nowrap">
                관리자
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-800 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-4 h-4 mr-1" />
                로그아웃
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-28 sm:pt-24 pb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              🦷 치과 마케팅 문의 관리
            </h1>
            <div className="text-sm text-gray-500">
              총 {inquiries.length}건의 문의
            </div>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">아직 수집된 문의가 없습니다.</p>
            </div>
          ) : (
            <>
              {/* 데스크톱 테이블 뷰 */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        접수일시
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이름
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        치과명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        연락처
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이메일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        추천 솔루션
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        퀴즈 답변 상세
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentInquiries.map((inquiry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(inquiry.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {inquiry.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inquiry.clinicName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inquiry.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inquiry.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            inquiry.recommendedSolution.includes('전략') ? 'bg-purple-100 text-purple-800' :
                            inquiry.recommendedSolution.includes('콘텐츠') ? 'bg-green-100 text-green-800' :
                            inquiry.recommendedSolution.includes('성과') ? 'bg-blue-100 text-blue-800' :
                            inquiry.recommendedSolution.includes('소셜') ? 'bg-pink-100 text-pink-800' :
                            inquiry.recommendedSolution.includes('데이터') ? 'bg-indigo-100 text-indigo-800' :
                            inquiry.recommendedSolution.includes('신규') ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {inquiry.recommendedSolution}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-md">
                            {renderAnswers(inquiry.answers)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 모바일 카드 뷰 */}
              <div className="md:hidden space-y-4">
                {currentInquiries.map((inquiry, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    {/* 카드 헤더 - 접수일시와 이름만 표시 */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleExpanded(index)}
                    >
                      <div className="flex justify-between items-center">
                                                 <div className="flex-1">
                           <div className="text-sm text-gray-500 mb-1">
                             {formatDate(inquiry.timestamp, true)}
                           </div>
                           <div className="font-medium text-gray-900">
                             {inquiry.name}
                           </div>
                           <div className="text-sm text-gray-600">
                             {inquiry.clinicName}
                           </div>
                         </div>
                        <div className="ml-4">
                          {expandedItems.has(index) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 확장된 내용 */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedItems.has(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                        <div>
                          <span className="text-sm font-medium text-gray-500">치과명:</span>
                          <span className="ml-2 text-sm text-gray-900">{inquiry.clinicName}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">연락처:</span>
                          <span className="ml-2 text-sm text-gray-900">{inquiry.phone}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">이메일:</span>
                          <span className="ml-2 text-sm text-gray-900">{inquiry.email}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">추천 솔루션:</span>
                          <span className="ml-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              inquiry.recommendedSolution.includes('전략') ? 'bg-purple-100 text-purple-800' :
                              inquiry.recommendedSolution.includes('콘텐츠') ? 'bg-green-100 text-green-800' :
                              inquiry.recommendedSolution.includes('성과') ? 'bg-blue-100 text-blue-800' :
                              inquiry.recommendedSolution.includes('소셜') ? 'bg-pink-100 text-pink-800' :
                              inquiry.recommendedSolution.includes('데이터') ? 'bg-indigo-100 text-indigo-800' :
                              inquiry.recommendedSolution.includes('신규') ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {inquiry.recommendedSolution}
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">퀴즈 답변:</span>
                          <div className="mt-2">
                            {renderAnswers(inquiry.answers)}
                          </div>
                        </div>
                      </div>
                                         </div>
                   </div>
                 ))}
               </div>

              {/* 페이징 컨트롤 */}
              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-2">
                  {/* 이전 페이지 버튼 */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  
                  {/* 페이지 번호들 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  {/* 다음 페이지 버튼 */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              </div>

              {/* 페이지 정보 */}
              <div className="mt-2 text-center text-sm text-gray-500">
                {startIndex + 1}-{Math.min(endIndex, inquiries.length)} / {inquiries.length}건
              </div>
             </>
           )}

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={fetchInquiries}
                className="bg-blue-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                새로고침
              </button>
              <button
                onClick={downloadExcel}
                disabled={inquiries.length === 0}
                className="bg-green-600 text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                엑셀 다운로드
              </button>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-right w-full sm:w-auto">
              마지막 업데이트: {new Date().toLocaleString('ko-KR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 