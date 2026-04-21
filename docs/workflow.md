# 개발자 워크플로우 가이드

> 목표: **"커밋 시점에는 이미 통과된 상태"**
>
> pre-commit 훅에서 반려되지 않으려면, 커밋 전에 오류를 미리 수정해야 합니다.
> 이 가이드는 그 흐름을 설명합니다.

---

## 환경 설정 (최초 1회)

```bash
# 1. Node 버전 맞추기 (.nvmrc 기준: Node 22)
nvm use          # 또는 nvm install

# 2. 의존성 설치 (husky 훅 자동 활성화)
npm install

# 3. VS Code 권장 확장 설치
# VS Code에서 Ctrl+Shift+P → "Extensions: Show Recommended Extensions"
```

---

## 개발 사이클

```
코드 작성
  │
  ▼
[VS Code 저장] ── settings.json이 자동으로 ──► ESLint auto-fix
                                              ► Prettier format
  │
  ▼
git add <files>
  │
  ▼
npm run validate:fix   ← 커밋 전 권장 (자동 수정 일괄 적용)
  │  eslint --fix + prettier --write (전체 파일)
  │
  ▼
git commit
  │
  └─ [pre-commit 자동 실행]
       1. lint-staged  — 스테이징된 파일만 eslint --fix + prettier --write
       2. typecheck    — 전체 타입 검사 (~2-3s)
       ✅ 통과 시 커밋 완료
       ❌ 실패 시 오류 표시 후 커밋 취소
  │
  ▼
git push
  │
  └─ [pre-push 자동 실행]
       npm run validate (typecheck + lint + format + layers + build)
       ✅ 통과 시 푸시 완료
       ❌ 실패 시 푸시 취소
```

---

## 스크립트 레퍼런스

| 명령                      | 설명                           | 속도 | 사용 시점     |
| ------------------------- | ------------------------------ | ---- | ------------- |
| `npm run validate:fix`    | lint + format 자동 수정 (전체) | 빠름 | 커밋 전       |
| `npm run validate:staged` | lint-staged 수동 실행          | 빠름 | 확인용        |
| `npm run typecheck`       | TypeScript 타입 검사           | 빠름 | 수시          |
| `npm run lint`            | ESLint 전체 검사 (check only)  | 중간 | CI            |
| `npm run lint:fix`        | ESLint 전체 자동 수정          | 중간 | 수동 수정     |
| `npm run validate`        | 전체 검증 (build 포함)         | 느림 | CI / pre-push |

---

## pre-commit 훅 구조

```
git commit
  └─ .husky/pre-commit
       ├─ npx lint-staged     # 변경 파일만 (incremental)
       │    ├─ *.{ts,tsx,...}  → eslint --fix → prettier --write
       │    └─ *.{json,md,...} → prettier --write
       └─ npm run typecheck   # 전체 타입 검사
```

**lint-staged가 하는 일:**

1. `git stash`로 언스테이징 변경사항 임시 보관
2. 스테이징된 파일에 ESLint --fix + Prettier 실행
3. 수정된 파일을 자동으로 re-stage
4. stash pop으로 나머지 변경사항 복원

---

## 오류 유형별 대처

### Prettier 오류

```bash
npm run format          # 전체 자동 수정
# 또는
npm run validate:fix    # lint + format 함께
```

### ESLint auto-fix 가능한 오류

```bash
npm run lint:fix        # 자동 수정
```

### ESLint 수동 수정 필요한 오류

오류 메시지를 읽고 코드를 직접 수정합니다.

```bash
npm run lint            # 오류 목록 확인
```

### TypeScript 타입 오류

```bash
npm run typecheck       # 오류 목록 확인 후 코드 수정
```

### 아키텍처 레이어 위반

```bash
npm run layers          # 위반 경로 확인 후 import 경로 수정
# 참고: docs/architecture.md
```

---

## 환경 일관성

| 설정            | 파일                       | 역할                                               |
| --------------- | -------------------------- | -------------------------------------------------- |
| Node 버전       | `.nvmrc`                   | `22` — 로컬/CI 동일 버전 강제                      |
| npm 동작        | `.npmrc`                   | `engine-strict=true` — 버전 불일치 시 install 실패 |
| 런타임 요구사항 | `package.json engines`     | `node>=22`, `npm>=10`                              |
| IDE 자동 수정   | `.vscode/settings.json`    | 저장 시 ESLint fix + Prettier                      |
| CI Node 버전    | `.github/workflows/ci.yml` | `.nvmrc` 기반으로 자동 동기화                      |
