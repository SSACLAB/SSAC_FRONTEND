# 프로토콜: ADR (아키텍처 결정 기록) 생성

> 새 패키지 추가, 레이어 구조 변경, 기술 스택 결정 시 에이전트가 실행합니다.
> 인간의 역할: "X를 도입하겠다"는 의도만 전달.

---

## 트리거 조건

다음 중 하나 해당 시 ADR을 생성해야 합니다:
- 새 npm 패키지 설치
- 레이어 구조 변경 (`docs/architecture.md` 수정 필요 시)
- 공통 패턴/컨벤션 변경 (`docs/conventions.md` 수정 필요 시)
- 기존 설계를 다른 방식으로 대체

---

## 실행 단계

### STEP 1 — 다음 ADR 번호 확인

```bash
ls docs/decisions/[0-9]*.md | tail -1
# 마지막 번호 + 1 이 새 번호
```

### STEP 2 — ADR 파일 생성

파일명: `docs/decisions/<NNN>-<kebab-case-title>.md`

```markdown
# ADR-NNN: [결정 제목]

| 항목 | 내용 |
|---|---|
| 날짜 | YYYY-MM-DD |
| 상태 | Proposed / Accepted / Deprecated |
| 담당 에이전트 | Claude Code / Codex / 기타 |

## 컨텍스트

[왜 이 결정이 필요한가? 어떤 문제를 해결하는가?]

## 결정 사항

[무엇을 선택했는가? 구체적으로.]

## 고려한 대안

| 대안 | 거부 이유 |
|---|---|
| 대안 A | |
| 대안 B | |

## 트레이드오프

**얻는 것**: 
**잃는 것**: 

## 결과

[이 결정이 코드베이스에 미치는 영향. 관련 파일 목록.]

## 재검토 시점

[언제 이 결정을 재평가해야 하는가?]
```

### STEP 3 — 관련 docs/ 파일 업데이트

ADR 내용에 따라:
- 레이어 변경 → `docs/architecture.md` 업데이트
- 컨벤션 변경 → `docs/conventions.md` 업데이트
- 기술 부채 해소 → `docs/quality.md` 해당 TD 항목 상태 변경

### STEP 4 — AGENTS.md 포인터 확인

새 결정이 에이전트의 기본 행동을 변경하면 `AGENTS.md` 의사결정 트리 또는 금지 목록도 업데이트합니다.
