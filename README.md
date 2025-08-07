# 치과 마케팅 솔루션 추천 시스템

치과에 최적화된 마케팅 솔루션을 추천하는 웹 애플리케이션입니다.

## 주요 기능

- **AI 기반 솔루션 추천**: 간단한 퀴즈를 통해 치과에 최적화된 마케팅 솔루션 추천
- **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화된 사용자 경험
- **관리자 대시보드**: 문의 내역 관리 및 엑셀 다운로드 기능
- **실시간 데이터 처리**: 사용자 답변을 기반으로 한 실시간 솔루션 추천

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Prisma ORM)
- **Deployment**: Vercel
- **Package Manager**: npm

## 로컬 개발 환경 설정

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/pesuspense/qna-marketing-solution.git
   cd qna-marketing-solution
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   `.env` 파일을 생성하고 다음 내용을 추가:
   ```
   DATABASE_URL="file:./dev.db"
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="password123"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **데이터베이스 초기화**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **개발 서버 실행**
   ```bash
   npm run dev
   ```

6. **브라우저에서 확인**
   - 메인 페이지: http://localhost:3000
   - 퀴즈 페이지: http://localhost:3000/quiz
   - 관리자 로그인: http://localhost:3000/admin/login

## 배포 (Vercel)

### 1. Vercel 계정 설정
- [Vercel](https://vercel.com)에 가입
- GitHub 계정과 연결

### 2. 프로젝트 배포
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택: `pesuspense/qna-marketing-solution`
3. 프로젝트 설정에서 다음 환경 변수 추가:
   - `DATABASE_URL`: `file:./dev.db`
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: `password123`
   - `NEXTAUTH_SECRET`: 임의의 문자열 (예: `your-secret-key-here`)
   - `NEXTAUTH_URL`: 배포된 URL (예: `https://your-project.vercel.app`)

### 3. 관리자 접속
- 배포 완료 후 `https://your-project.vercel.app/admin/login` 접속
- 사용자명: `admin`, 비밀번호: `password123`

## 프로젝트 구조

```
qna-marketing-solution/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # 관리자 페이지
│   │   ├── api/            # API 라우트
│   │   ├── quiz/           # 퀴즈 페이지
│   │   └── page.tsx        # 메인 페이지
│   ├── components/         # React 컴포넌트
│   ├── data/              # 정적 데이터
│   ├── lib/               # 유틸리티 함수
│   ├── types/             # TypeScript 타입 정의
│   └── utils/             # 헬퍼 함수
├── prisma/                # 데이터베이스 스키마
├── public/                # 정적 파일
└── data/                  # CSV 데이터 파일
```

## 라이선스

MIT License
