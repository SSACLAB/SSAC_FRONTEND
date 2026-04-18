# 프로토콜: 새 기능 추가

> 에이전트가 새 도메인 기능을 추가할 때 순서대로 실행하는 프로토콜입니다.
> 각 단계는 독립적으로 검증 가능합니다.

---

## 입력 (인간이 정의하는 의도)

```
도메인명: <예: "users">
기능 설명: <예: "사용자 목록을 API에서 가져와 카드 형태로 표시">
API 엔드포인트: <예: "GET /users">
```

---

## 실행 단계

### STEP 1 — 타입 정의 (`src/types/index.ts`)

```typescript
// 추가할 타입 패턴
export interface <DomainName> {
  id: number;
  // API 응답 필드 추가
}
```

검증: `npx tsc --noEmit` → 0 오류

---

### STEP 2 — 서비스 생성 (`src/services/<domain>.ts`)

```typescript
import { apiClient } from './api';
import type { <DomainName> } from '@/types';

export const <domain>Service = {
  getAll(): Promise<<DomainName>[]> {
    return apiClient.get<<DomainName>[]>('/<domain>');
  },
  getById(id: number): Promise<<DomainName>> {
    return apiClient.get<<DomainName>>(`/<domain>/${id}`);
  },
};
```

검증: `npx tsc --noEmit` → 0 오류

---

### STEP 3 — 카드 컴포넌트 (`src/features/<domain>/<DomainName>Card.tsx`)

```typescript
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { <DomainName> } from '@/types';

interface <DomainName>CardProps {
  item: <DomainName>;
}

export function <DomainName>Card({ item }: <DomainName>CardProps) {
  return (
    <Card>
      <CardHeader>...</CardHeader>
      <CardBody>...</CardBody>
    </Card>
  );
}
```

금지: `services/` import 없음 — 데이터는 props로만 수신

검증: `npm run lint` → 0 오류

---

### STEP 4 — 리스트 컴포넌트 (`src/features/<domain>/<DomainName>List.tsx`)

```typescript
'use client';

import { useFetch } from '@/hooks/useFetch';
import { <domain>Service } from '@/services/<domain>';
import { <DomainName>Card } from './<DomainName>Card';

export function <DomainName>List() {
  const { data, isLoading, error } = useFetch(() => <domain>Service.getAll());

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  // ...
}
```

---

### STEP 5 — 페이지 연결 (`src/app/<route>/page.tsx`)

```typescript
import type { Metadata } from 'next';
import { <DomainName>List } from '@/features/<domain>/<DomainName>List';

export const metadata: Metadata = { title: '<도메인명>' };

export default function <DomainName>Page() {
  return (
    <div className="container-page py-12">
      <h1>...</h1>
      <<DomainName>List />
    </div>
  );
}
```

금지: 이 파일에서 `services/` import 없음

---

### STEP 6 — 최종 검증 시퀀스

```bash
npx tsc --noEmit   # 타입 오류 0
npm run lint       # ESLint 오류 0
npm run format     # 포맷 적용
npm run build      # 빌드 성공
```

모두 통과 → PR 생성 가능
실패 → 오류 메시지의 `[FIX]` 지시 따라 수정 후 재실행

---

## 완료 조건

- [ ] `src/types/index.ts`에 타입 추가됨
- [ ] `src/services/<domain>.ts` 생성됨
- [ ] `src/features/<domain>/` 컴포넌트 생성됨
- [ ] `src/app/<route>/page.tsx` 생성됨
- [ ] 4단계 검증 모두 통과
- [ ] Header 네비게이션에 새 링크 추가됨 (UI 진입점 있을 경우)
