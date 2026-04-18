# 프로토콜: 하네스 감사 (주간)

> 이 프로토콜은 에이전트가 실행합니다. 인간이 체크리스트를 수동으로 채우지 않습니다.
> 인간의 역할: 이 프로토콜을 언제 실행할지 지시하는 것 (의도 정의).

---

## 입력 (인간이 정의)

```
감사 기간: 지난 N일 (기본: 7일)
```

---

## 실행 단계

### STEP 1 — 반복 실수 패턴 수집

```bash
# 최근 커밋 메시지에서 fix/lint 관련 패턴 찾기
git log --oneline --since="7 days ago" | grep -iE "fix|lint|type|layer|import"

# CI 실패 로그에서 반복 오류 패턴 찾기 (GitHub Actions 사용 시)
# gh run list --limit 20 --json conclusion,name | jq '.[] | select(.conclusion=="failure")'
```

반복된 오류 유형을 목록으로 정리합니다.

---

### STEP 2 — docs/ 유효성 검사

각 파일의 내용이 현재 코드 상태와 일치하는지 검사합니다:

```bash
# architecture.md 가 언급한 디렉토리가 실제로 존재하는가?
ls src/app src/features src/components src/hooks src/services src/lib src/types

# conventions.md 의 네이밍 규칙이 현재 파일들에 적용됐는가?
# (컴포넌트 파일이 PascalCase인지)
find src -name "*.tsx" | grep -v "^src/app" | grep -vE "^[A-Z]" | head -10

# quality.md 의 기술 부채 목록 중 해소된 항목이 있는가?
# → TD-001 ~ TD-005 각 항목에 대해 현재 상태 재평가
```

`docs/` 내용이 코드와 불일치하면 해당 파일을 즉시 업데이트합니다.

---

### STEP 3 — ESLint 규칙 효과 측정

```bash
# 전체 코드베이스에 현재 lint 실행
npm run lint 2>&1 | grep "error\|warning" | sort | uniq -c | sort -rn
```

출력 결과를 분석합니다:
- 오류 0개 → 현재 규칙이 작동 중
- 동일 오류가 3개 이상 → STEP 4로 이동

---

### STEP 4 — 하네스 강화 결정

STEP 1~3에서 발견된 반복 패턴에 대해:

```
패턴 발생 횟수별 조치:

1회 → 기록만 (mistake-log 생성)
2회 → AGENTS.md 금지 목록 또는 프로토콜 업데이트
3회 이상 → ESLint 규칙 추가 필수
```

ESLint 규칙 추가 시 반드시 포함할 내용:
```javascript
// eslint.config.mjs 패턴
{
  rules: {
    'rule-name': ['error', {
      // ...
      message: '[FIX] 구체적인 수정 방법. docs/해당파일.md 참조.'
    }]
  }
}
```

---

### STEP 5 — 감사 보고서 생성

`docs/decisions/harness-audit-YYYY-MM-DD.md` 를 생성합니다:

```markdown
# 하네스 감사 — YYYY-MM-DD

## 발견된 반복 패턴
| 패턴 | 횟수 | 심각도 |
|---|---|---|
| (내용) | N | 높음/중간/낮음 |

## 수행된 하네스 업데이트
- [ ] eslint.config.mjs: (변경 내용)
- [ ] AGENTS.md: (변경 내용)
- [ ] docs/: (변경 내용)

## 다음 감사까지 모니터링할 항목
- (항목 1)
- (항목 2)

## 현재 하네스 강도 평가
- 자동 차단 가능한 오류 유형: N개
- 수동 확인이 필요한 영역: (목록)
- 다음 우선 강화 대상: (항목)
```

---

## 완료 조건

- [ ] STEP 1~3 실행 완료
- [ ] 반복 패턴에 대한 하네스 업데이트 완료
- [ ] `docs/decisions/harness-audit-YYYY-MM-DD.md` 생성
- [ ] `docs/quality.md` 품질 등급 최신화
