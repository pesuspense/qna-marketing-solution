# 치과 마케팅 솔루션 추천 시스템

치과에 최적화된 마케팅 솔루션을 추천해주는 웹 애플리케이션입니다.

## 기능

- 🦷 치과 맞춤형 마케팅 솔루션 추천
- 📊 AI 기반 답변 분석
- 📱 반응형 웹 디자인
- 🔐 관리자 페이지
- 📄 엑셀 다운로드 기능

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Prisma)
- **Deployment**: Vercel

## 로컬 개발

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`env.example` 파일을 `.env.local`로 복사하고 필요한 값들을 설정하세요:

```bash
cp env.example .env.local
```

### 3. 데이터베이스 설정

```bash
npx prisma generate
npx prisma db push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 배포 (Vercel)

### 1. Vercel 계정 생성

[Vercel](https://vercel.com)에 가입하고 GitHub 계정과 연결하세요.

### 2. 프로젝트 배포

1. GitHub에 프로젝트를 푸시하세요
2. Vercel 대시보드에서 "New Project" 클릭
3. GitHub 저장소 선택
4. 환경 변수 설정:
   - `DATABASE_URL`: SQLite 파일 경로 (Vercel에서는 `file:./dev.db` 사용)
   - `ADMIN_USERNAME`: 관리자 사용자명
   - `ADMIN_PASSWORD`: 관리자 비밀번호
   - `NEXTAUTH_SECRET`: 랜덤 시크릿 키
   - `NEXTAUTH_URL`: 배포된 URL

### 3. 배포 후 설정

배포가 완료되면 Vercel에서 제공하는 URL로 접속할 수 있습니다.

## 관리자 접속

- URL: `/admin/login`
- 기본 계정: `admin` / `password123` (환경 변수에서 변경 가능)

## 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── admin/          # 관리자 페이지
│   ├── api/            # API 라우트
│   ├── quiz/           # 퀴즈 페이지
│   └── page.tsx        # 메인 페이지
├── components/         # React 컴포넌트
├── data/              # 퀴즈 데이터
├── lib/               # 유틸리티 함수
├── types/             # TypeScript 타입 정의
└── utils/             # 헬퍼 함수
```

## 라이선스

MIT License
