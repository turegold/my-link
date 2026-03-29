# GEMINI.md - 프로젝트 컨텍스트

이 파일은 `my-profile` (서비스명: **마이링크 - MyLink**) 저장소에서 Gemini CLI가 효과적으로 작업을 수행할 수 있도록 프로젝트의 핵심 정보를 제공합니다. 모든 개발 작업은 아래 명시된 기획 및 기술 사양을 최우선으로 준수해야 합니다.

## 1. 프로젝트 개요
- **프로젝트명:** 마이링크 (MyLink)
- **목적:** 링크트리(Linktree)의 핵심 기능을 구현한 클론 서비스. 사용자가 본인의 여러 웹사이트 링크를 단일 URL 슬러그 주소를 통해 관리하고 공유할 수 있게 합니다.
- **핵심 가치:** 번거로운 가입 절차 최소화 (구글 로그인), 직관적인 편집 (인라인 편집), 시각적 편의성 (자동 파비콘 추출).

## 2. 주요 기능 및 요구사항 (PRD 기반)

### 2.1. 인증 및 온보딩
- **Firebase Auth:** 구글 소셜 로그인만 지원합니다.
- **URL 슬러그 자동 설정:** 최초 로그인 시 지메일 아이디의 앞부분을 가져와 `displayName`으로 저장하며, 이것이 사용자의 고유 접속 URL 슬러그가 됩니다 (예: `domain.com/abc`).

### 2.2. 링크 및 프로필 관리 (인라인 편집)
- **인라인 편집 (Inline Editing):** 별도의 폼 페이지 이동 없이 텍스트 클릭 시 즉시 입력칸이 활성화되어 수정하고, 엔터 또는 포커스 아웃 시 즉시 저장되는 UX를 제공합니다.
- **프로필 정보:** `username`(실제 노출 이름)과 `bio`(자기소개)를 관리합니다. (프로필 이미지는 구글 계정 정보를 기본으로 사용)
- **링크 관리:** 링크 제목과 URL을 CRUD 할 수 있으며, 구글 파비콘 API(`https://s2.googleusercontent.com/s2/favicons?domain=...`)를 사용하여 아이콘을 자동으로 렌더링합니다.
- **리스트 정렬:** 새로 추가된 링크는 목록의 최상단에 위치합니다.

### 2.3. 퍼블릭 프로필 페이지
- **동적 라우팅:** `/[displayName]` 경로를 통해 누구나 접속 가능한 전용 프로필 페이지를 노출합니다.

## 3. 기술 스택 및 라이브러리

- **Framework:** Next.js 16.1.6 (App Router)
- **Library:** React 19.2.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (PostCSS 기반)
- **UI Components:** shadcn/ui (Radix UI 기반)
- **Backend:** Firebase (Authentication, Firestore)
- **Icons:** Tabler Icons (`@tabler/icons-react`)

## 4. 데이터 아키텍처 (Firestore)

- **`users` (Collection):** 회원 식별 및 프로필 정보
  - `uid`, `email`, `username`, `displayName` (URL Slug), `photoURL`, `bio`, `createdAt`
- **`links` (Sub-collection):** `users/{uid}/links` 경로에 개별 링크 문서 저장
  - `id`, `title`, `url`, `createdAt`

## 5. 프로젝트 구조

- `app/`: Next.js App Router 기반의 경로 및 레이아웃 정의.
- `components/`: UI 및 비즈니스 로직 컴포넌트 (`About`, `Contact`, `Hero`, `Projects`, `Skills` 등 존재).
- `components/ui/`: shadcn/ui 기반 원자 단위 컴포넌트.
- `lib/`: 유틸리티 함수 및 공통 로직.
- `docs/`: PRD, 사용자 시나리오, 와이어프레임 등 기획 문서.

## 6. 빌드 및 실행 명령어

| 명령어 | 설명 |
| :--- | :--- |
| `npm run dev` | 로컬 개발 서버 시작 (`http://localhost:3000`) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run start` | 빌드된 프로덕션 서버 실행 |
| `npm run lint` | ESLint를 사용한 코드 품질 및 스타일 체크 |

## 7. 개발 컨벤션 및 스타일

- **Tailwind CSS v4:** 유틸리티 클래스 우선 방식을 사용하며, `app/globals.css`에서 `@import "tailwindcss"`를 통해 통합합니다.
- **TypeScript:** 엄격한 타입 체크(`strict: true`)를 준수합니다.
- **절대 경로:** `@/` 에일리어스를 사용하여 파일을 임포트합니다.
- **인라인 편집 구현:** 사용자 경험을 위해 데이터 변경 성공 시 토스트 알림을 제공하고, 삭제 시에는 반드시 확인 모달을 띄웁니다.
