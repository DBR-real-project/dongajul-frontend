'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Shield, CheckCircle, Building2, Target, FileText, Loader2 } from 'lucide-react';
import { DiagnosisData } from './DiagnosisResult';
import { apiFetch } from '../utils/api';
import { useArticleCount } from '../utils/articleCount';

interface DiagnosisInterviewProps {
  onResultClick: (data: DiagnosisData) => void;
  darkMode?: boolean;
}

const INDUSTRIES = [
  '제조업', 'IT/소프트웨어', '유통/리테일', '금융/핀테크', '의료/헬스케어',
  '식품/외식', '교육', '물류/운송', '에너지', '미디어/엔터테인먼트',
  '건설/부동산', 'AI/데이터', '바이오/제약', '패션/뷰티', '기타'
];

const STRATEGY_TYPES = [
  '신시장 진출', '디지털 전환', '원가 절감', '제품 혁신', 'M&A',
  '해외 진출', '플랫폼 구축', '구독 모델 전환', '브랜드 리포지셔닝', '기타'
];

export function DiagnosisInterview({ onResultClick, darkMode = false }: DiagnosisInterviewProps) {
  const articleCount = useArticleCount();
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [strategyType, setStrategyType] = useState('');
  const [customStrategyType, setCustomStrategyType] = useState('');
  const [strategyText, setStrategyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = 3;

  const handleAnalyze = async () => {
    if (!strategyText.trim()) return;
    setLoading(true);
    setError('');
    try {
      const finalIndustry = industry === '기타' ? (customIndustry.trim() || '기타') : industry;
      const finalStrategyType = strategyType === '기타' ? (customStrategyType.trim() || '기타') : strategyType;
      const fullText = `[산업군: ${finalIndustry}] [전략유형: ${finalStrategyType}] ${strategyText}`;
      const res = await apiFetch('/api/diagnose', {
        method: 'POST',
        body: JSON.stringify({
          text: fullText,
          top_k: 5,
          user_id: JSON.parse(localStorage.getItem('user') || '{}').id || null,
        }),
      });
      const data: DiagnosisData = await res.json();
      if (!res.ok) throw new Error((data as any).error || '분석 실패');
      data.input_text = strategyText;
      onResultClick(data);
    } catch (e: any) {
      setError(e.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 🎨 기본 카드 및 선택된 카드의 3D 네온 골드 테두리 명세 변경
  const card = `${darkMode ? 'bg-gray-800/40 border-gray-700/50 hover:border-gray-600' : 'bg-white border-gray-200'} border rounded-2xl p-4 cursor-pointer transition-all duration-200`;
  const selectedCard = `${darkMode ? 'bg-[#142755]/40 border-[#E5BA73] shadow-[0_0_15px_rgba(229,186,115,0.15)]' : 'bg-[#EEF2FF] border-[#142755]'} border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200`;

  return (
    <div className={`h-full overflow-y-auto ${darkMode ? 'bg-[#0A0E1A]' : 'bg-[#F8FAFC]'} pb-20`}>
      {/* 헤더 */}
      <div className={`sticky top-0 z-40 border-b ${darkMode ? 'bg-[#0A0E1A]/90 backdrop-blur-xl border-gray-800/50' : 'bg-white/90 backdrop-blur-xl border-gray-200/50'}`}>
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-[#142755] to-[#3B547E] border border-white/5 rounded-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>전략 리스크 진단</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>DBR·HBR {articleCount}건 사례 기반 AI 분석</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex-1 flex items-center gap-2">
                <div className={`flex-1 h-1.5 rounded-full transition-all ${i < step ? (darkMode ? 'bg-[#E5BA73]' : 'bg-[#142755]') : darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
              </div>
            ))}
            <span className={`text-xs font-semibold ${darkMode ? 'text-[#E5BA73]' : 'text-gray-500'} whitespace-nowrap`}>{step}/{totalSteps}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* STEP 1: 산업군 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {/* 🌟 다크모드 시 숫자 배지 배경을 금색으로 스위칭 */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${darkMode ? 'bg-[#E5BA73] text-[#0A0E1A]' : 'bg-[#142755] text-white'}`}>1</div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-[#E5BA73]' : 'text-gray-900'}`}>어느 산업군에 속하시나요?</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>분석 정확도를 높이기 위해 산업군을 선택해주세요.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  className={industry === ind ? selectedCard : card}
                >
                  {/* 🌟 선택된 카드의 텍스트 색상을 다크모드일 때 우리 금색(#E5BA73)으로 인젝션 */}
                  <span className={`text-sm font-semibold transition-colors ${industry === ind ? (darkMode ? 'text-[#E5BA73]' : 'text-[#142755]') : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-700'}`}>
                    {industry === ind && <CheckCircle className={`w-3.5 h-3.5 inline mr-1.5 ${darkMode ? 'text-[#E5BA73]' : 'text-[#142755]'}`} />}
                    {ind}
                  </span>
                </button>
              ))}
            </div>
            {industry === '기타' && (
              <input
                type="text"
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                placeholder="산업군을 직접 입력해주세요"
                className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#E5BA73] focus:border-[#E5BA73] ${darkMode ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-600' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
              />
            )}
            <div className="flex justify-end">
              <button
                onClick={() => industry && setStep(2)}
                disabled={!industry || (industry === '기타' && !customIndustry.trim())}
                className={`flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg ${darkMode ? 'bg-gradient-to-r from-[#C8994B] to-[#E5BA73] text-[#0A0E1A]' : 'bg-gradient-to-r from-[#142755] to-[#3B547E]'}`}
              >
                다음 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 전략 유형 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${darkMode ? 'bg-[#E5BA73] text-[#0A0E1A]' : 'bg-[#142755] text-white'}`}>2</div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-[#E5BA73]' : 'text-gray-900'}`}>어떤 유형의 전략인가요?</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>가장 가까운 전략 유형을 선택해주세요.</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2.5 ${darkMode ? 'bg-[#142755]/20 border-[#E5BA73]/30' : 'bg-blue-50 border-blue-100'} border rounded-xl`}>
              <Building2 className={`w-4 h-4 ${darkMode ? 'text-[#E5BA73]' : 'text-blue-500'} flex-shrink-0`} />
              <span className={`text-sm font-semibold ${darkMode ? 'text-[#E5BA73]' : 'text-blue-700'}`}>선택한 산업군: {industry}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {STRATEGY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setStrategyType(type)}
                  className={strategyType === type ? selectedCard : card}
                >
                  <span className={`text-sm font-semibold transition-colors ${strategyType === type ? (darkMode ? 'text-[#E5BA73]' : 'text-[#142755]') : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-700'}`}>
                    {strategyType === type && <CheckCircle className={`w-3.5 h-3.5 inline mr-1.5 ${darkMode ? 'text-[#E5BA73]' : 'text-[#142755]'}`} />}
                    {type}
                  </span>
                </button>
              ))}
            </div>
            {strategyType === '기타' && (
              <input
                type="text"
                value={customStrategyType}
                onChange={(e) => setCustomStrategyType(e.target.value)}
                placeholder="전략 유형을 직접 입력해주세요"
                className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#E5BA73] focus:border-[#E5BA73] ${darkMode ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-600' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
              />
            )}
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} transition-all`}>
                <ArrowLeft className="w-4 h-4" /> 이전
              </button>
              <button
                onClick={() => strategyType && setStep(3)}
                disabled={!strategyType || (strategyType === '기타' && !customStrategyType.trim())}
                className={`flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shadow-lg ${darkMode ? 'bg-gradient-to-r from-[#C8994B] to-[#E5BA73] text-[#0A0E1A]' : 'bg-gradient-to-r from-[#142755] to-[#3B547E]'}`}
              >
                다음 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: 전략 입력 + 분석 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${darkMode ? 'bg-[#E5BA73] text-[#0A0E1A]' : 'bg-[#142755] text-white'}`}>3</div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-[#E5BA73]' : 'text-gray-900'}`}>전략을 설명해주세요</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>구체적일수록 더 정확한 리스크 진단이 가능합니다.</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { icon: Building2, label: '산업군', value: industry },
                { icon: Target, label: '전략 유형', value: strategyType },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className={`flex items-center gap-3 px-4 py-2.5 ${darkMode ? 'bg-gray-800/40 border-gray-700/60' : 'bg-gray-50 border-gray-200'} border rounded-xl`}>
                  <Icon className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{label}</span>
                  {/* 🌟 요약창 결과 글씨 금색 매핑 */}
                  <span className={`text-sm font-bold ${darkMode ? 'text-[#E5BA73]' : 'text-gray-800'} ml-1`}>{value}</span>
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-gray-800/30 border-gray-700/60' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <FileText className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>전략 내용</span>
              </div>
              <textarea
                value={strategyText}
                onChange={(e) => setStrategyText(e.target.value)}
                rows={6}
                placeholder={`예시:\n"우리 회사는 AI 기반 물류 자동화 솔루션을 개발하여 국내 중소 물류사에 SaaS 형태로 제공하고, 3년 내 동남아시아 시장에 진출할 계획입니다. 초기 투자비용은 10억 원이며, 월 구독 방식으로 수익화할 예정입니다."`}
                className={`w-full text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#E5BA73] focus:border-[#E5BA73] rounded-xl px-3 py-2.5 transition-all ${darkMode ? 'bg-gray-900/50 text-white placeholder-gray-600 border border-gray-700/80' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200'}`}
              />
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {strategyText.length}자 · 50자 이상 입력할수록 분석 정확도가 높아집니다
              </p>
            </div>

            {error && <p className="text-sm text-red-500 font-bold">{error}</p>}

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} transition-all`}>
                <ArrowLeft className="w-4 h-4" /> 이전
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading || strategyText.trim().length < 10}
                className={`flex items-center gap-2 px-8 py-3 font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all text-sm ${darkMode ? 'bg-gradient-to-r from-[#C8994B] to-[#E5BA73] text-[#0A0E1A]' : 'bg-gradient-to-r from-[#142755] to-[#3B547E] text-white'}`}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> AI 분석 중...</>
                ) : (
                  <><Shield className="w-4 h-4" /> 리스크 진단 시작</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 하단 설명 */}
        <div className={`mt-6 p-4 rounded-xl border ${darkMode ? 'bg-gray-900/20 border-gray-800/80' : 'bg-blue-50/50 border-blue-100'}`}>
          <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            💡 <strong className={darkMode ? 'text-[#E5BA73] font-bold' : 'text-gray-700'}>동아줄 AI</strong>는 {articleCount}건의 DBR·HBR 경영 사례를 SBERT 임베딩으로 분석하여 전략과 가장 유사한 성공·실패 사례를 탐색하고, MLP 분류기로 리스크 확률을 산출합니다.
          </p>
        </div>
      </div>
    </div>
  );
}