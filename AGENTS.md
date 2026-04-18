# AGENTS.md — 에이전트 실행 프로토콜

> **이 파일은 읽는 문서가 아닙니다. 실행하는 프로토콜입니다.**
> 모든 지시는 에이전트가 사람의 개입 없이 완수할 수 있는 형태로 작성되어 있습니다.

---

## 이 저장소

SSAC_FRONTEND — Next.js 15 App Router + TypeScript strict + Tailwind CSS v4 프론트엔드.
3인 팀이 AI 에이전트와 함께 개발합니다.

---

## 태스크 시작 시 실행 순서 (매번)

```
1. docs/architecture.md   → 내가 만들 파일이 어느 레이어인지 확인
2. docs/conventions.md    → 해당 파일의 네이밍/형식 규칙 확인
3. npm run lint           → 현재 위반 목록 파악 (내 변경 전 baseline)
```

이 3단계를 건너뛰면 이후 수정 비용이 증가합니다.

---

## 파일 생성 의사결정 트리

```
새 파일을 만들어야 할 때:

Q1. 타입 정의인가?
    YES → src/types/index.ts 에 추가 (새 파일 불필요)

Q2. 여러 도메인에서 쓰이는 유틸/훅인가?
    YES → src/lib/ 또는 src/hooks/

Q3. API 통신 로직인가?
    YES → src/services/<domain>.ts

Q4. 특정 도메인에서만 쓰이는 UI 컴포넌트인가?
    YES → src/features/<domain>/<ComponentName>.tsx

Q5. 여러 도메인에서 쓰이는 순수 UI 컴포넌트인가?
    YES → src/components/ui/<ComponentName>.tsx

Q6. Next.js 페이지인가?
    YES → src/app/<route>/page.tsx
         (비즈니스 로직 없이 features/ 컴포넌트만 조립)

판단 불가 → docs/architecture.md 의 레이어 매트릭스 참조
```

---

## import 작성 전 확인

```
현재 파일 레이어 → import 하려는 레이어 방향이 허용되는가?

허용: 위 → 아래 방향만
  app → features → components → hooks/services → lib/types

즉시 금지 (ESLint가 잡지만 사전에 확인):
  app/       → services/ 직접 import    ❌
  components/ → services/ import        ❌
  components/ → features/ import        ❌
  lib/types   → 어느 레이어든 import     ❌
```

---

## 커밋 전 자동 검증 시퀀스

에이전트는 아래를 순서대로 실행하고, **모두 0 오류**일 때만 커밋합니다.

```bash
# 1. 타입 오류 검사
npx tsc --noEmit

# 2. 레이어 위반 + 코드 품질 검사
npm run lint

# 3. 포맷 자동 적용 (확인이 아닌 수정)
npm run format

# 4. 빌드 성공 확인
npm run build
```

오류 발생 시:
- ESLint 오류 → 오류 메시지 안의 `[FIX]` 지시를 따라 수정
- 빌드 오류 → 오류 스택에서 파일:라인 추출 후 수정
- 반복 실패(2회 이상 동일 오류) → `docs/agent-protocols/self-diagnose.md` 실행

---

## 에이전트 금지 행동

| 금지 | 위반 시 결과 |
|---|---|
| `main` 브랜치 직접 커밋 | CI가 차단하지 않으므로 팀 합의 파괴 |
| `any` 타입 사용 | ESLint error — 빌드 불가 |
| `process.env.*` 직접 접근 | `src/lib/env.ts` 경유 필수 |
| 검증 없이 PR 생성 | CI 실패 = 팀원 리뷰 시간 낭비 |
| `docs/` 수정 없이 아키텍처 변경 | 다음 에이전트가 잘못된 정보로 작업 |
| 패키지 임의 추가 | `docs/decisions/` ADR 없이 불가 |

---

## 판단 불가 상황별 참조 프로토콜

| 상황 | 실행할 프로토콜 |
|---|---|
| 파일 위치 불확실 | `docs/architecture.md` → 레이어 매트릭스 |
| 네이밍 불확실 | `docs/conventions.md` → 대상별 규칙 표 |
| "왜 이렇게 됐지?" | `docs/decisions/` → ADR 목록 |
| CI 반복 실패 | `docs/agent-protocols/self-diagnose.md` |
| 새 기능 추가 흐름 | `docs/agent-protocols/new-feature.md` |
| 처음 세팅 | `docs/onboarding.md` |
| 기술 부채 발견 | `docs/quality.md` → TD 항목 추가 |
