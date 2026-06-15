import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useArticleCount } from '../utils/articleCount';

interface SignupScreenProps {
  onSignup: (email: string, token: string) => void;
  onBackToLogin: () => void;
}

export function SignupScreen({ onSignup, onBackToLogin }: SignupScreenProps) {
  const articleCount = useArticleCount();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('이름을 입력해주세요.'); return; }
    if (!email.trim() || !email.includes('@')) { setError('올바른 이메일을 입력해주세요.'); return; }
    if (password.length < 6) { setError('비밀번호는 최소 6자 이상이어야 합니다.'); return; }
    if (password !== confirmPassword) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (!agreeTerms) { setError('이용약관에 동의해주세요.'); return; }

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        onSignup(data.user.email, data.token);
      } else {
        setError(data.message || '회원가입 실패');
      }
    } catch (err) {
      console.error(err);
      setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    // 최상단 부모는 flex items-center justify-center로 내부 요소들을 화면 정중앙으로 모읍니다.
    <div className="fixed inset-0 flex items-center justify-center bg-[#060B18] overflow-y-auto p-4 md:p-8 font-sans selection:bg-[#142755] selection:text-white">
      
      {/* 배경 이미지 및 딥 남색 오버레이 */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Analytics Dashboard Background"
          className="w-full h-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#060B16] via-[#0B1528] to-[#11203E]"></div>
      </div>

      {/* 배경 블러 서클 효과 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E5BA73]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* 🌟 [핵심 변경] 중간 거리를 좁히기 위한 최대 너비 제한 래퍼 (max-w-5xl 및 gap-12 적용) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 items-center px-4">
        
        {/* [왼쪽 영역] 브랜드 텍스트 - 과도한 왼쪽 패딩을 제거하여 카드와 밀착시킴 */}
        <div className="text-center md:text-left text-white py-4 md:py-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            동아줄 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-200">AI</span>
          </h1>
          <p className="text-lg md:text-2xl font-medium text-gray-300 mb-6 tracking-wide">AI 전략 리스크 진단 플랫폼</p>
          <p className="text-xs md:text-sm lg:text-base text-slate-400 leading-relaxed font-light max-w-md mx-auto md:mx-0">
            <span className="text-slate-300 font-medium">DBR·HBR</span> <span className="text-amber-400/90 font-medium">{articleCount}건 성공·실패 사례</span>를 분석해
            <br className="hidden md:inline" />
            당신의 전략이 가진 <span className="text-amber-400/90 font-medium">리스크를 정확히 진단</span>합니다.
          </p>
        </div>

        {/* [오른쪽 영역] 회원가입 폼 카드 - 부모 그리드가 꽉 잡아주어 거리가 고정됨 */}
        <div className="flex justify-center md:justify-end w-full">
          <div className="bg-white rounded-[24px] shadow-2xl p-7 md:p-8 w-full max-w-[420px] border border-gray-100 text-slate-900">
            
            {/* 로그인으로 돌아가기 */}
            <button
              onClick={onBackToLogin}
              className="flex items-center gap-2 text-gray-400 hover:text-[#142755] mb-5 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-xs font-semibold">로그인으로 돌아가기</span>
            </button>

            {/* 타이틀 헤더 */}
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold mb-1 text-gray-900 tracking-tight">회원가입</h2>
              <p className="text-xs text-gray-400 font-medium">동아줄 AI와 함께 전략 리스크를 진단하세요</p>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* 입력 폼 */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block mb-1 text-xs text-slate-700 font-bold">
                  이름 <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#142755] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs text-slate-700 font-bold">
                  이메일 <span className="text-amber-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@company.com"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#142755] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs text-slate-700 font-bold">
                  비밀번호 <span className="text-amber-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="최소 6자 이상"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#142755] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs text-slate-700 font-bold">
                  비밀번호 확인 <span className="text-amber-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#142755] focus:border-transparent transition-all"
                />
              </div>

              {/* 약관 동의 */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-200 text-[#142755] focus:ring-[#142755] cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-xs font-medium text-slate-500 cursor-pointer select-none">
                  이용약관 및 개인정보 처리방침에 동의합니다
                </label>
              </div>

              {/* 완료 버튼 */}
              <button
                type="submit"
                className="w-full bg-[#142755] hover:bg-[#1f3a7a] text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] mt-3 text-sm tracking-wide"
              >
                회원가입 완료
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}