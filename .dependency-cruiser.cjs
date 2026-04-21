/**
 * .dependency-cruiser.cjs
 *
 * 이 파일이 아키텍처의 기계적 진실(machine truth)입니다.
 * docs/architecture.md 는 이 파일의 인간 가독성 설명입니다.
 *
 * 실행: npm run layers
 * CI:   .github/workflows/ci.yml 에서 자동 실행
 */

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // ──────────────────────────────────────────────
    // ARCH-001: app → services 직접 import 금지
    // app/ 레이어는 services/ 를 직접 알면 안 됩니다.
    // 반드시 features/ 컴포넌트를 경유하세요.
    // ──────────────────────────────────────────────
    {
      name: 'app-no-direct-services',
      severity: 'error',
      comment:
        '[ARCH-001] app/ → services/ 직접 import 금지. ' +
        'features/<domain>/ 컴포넌트를 경유하세요. ' +
        '예외: src/app/api/ Route Handler는 BFF 레이어이므로 services/ 직접 사용 허용. ' +
        '참고: docs/architecture.md',
      from: { path: '^src/app', pathNot: '^src/app/api' },
      to: { path: '^src/services' },
    },

    // ──────────────────────────────────────────────
    // ARCH-002: components → services 금지
    // 순수 UI 컴포넌트는 API를 직접 호출하면 안 됩니다.
    // 데이터는 Props로 받아야 합니다.
    // ──────────────────────────────────────────────
    {
      name: 'components-no-services',
      severity: 'error',
      comment:
        '[ARCH-002] components/ → services/ import 금지. ' +
        'Props로 데이터를 받도록 설계하세요. ' +
        '참고: docs/architecture.md',
      from: { path: '^src/components' },
      to: { path: '^src/services' },
    },

    // ──────────────────────────────────────────────
    // ARCH-003: components → features 금지
    // 공통 컴포넌트가 특정 도메인에 의존하면 재사용 불가.
    // ──────────────────────────────────────────────
    {
      name: 'components-no-features',
      severity: 'error',
      comment:
        '[ARCH-003] components/ → features/ import 금지. ' +
        '공통 컴포넌트는 도메인에 의존하지 않아야 합니다. ' +
        '참고: docs/architecture.md',
      from: { path: '^src/components' },
      to: { path: '^src/features' },
    },

    // ──────────────────────────────────────────────
    // ARCH-004: services → UI 레이어 금지
    // 서비스 레이어는 React/UI에 의존하면 안 됩니다.
    // ──────────────────────────────────────────────
    {
      name: 'services-no-ui',
      severity: 'error',
      comment:
        '[ARCH-004] services/ → components|features|app import 금지. ' +
        '서비스는 순수 async 함수여야 합니다. ' +
        '참고: docs/architecture.md',
      from: { path: '^src/services' },
      to: { path: '^src/(components|features|app)' },
    },

    // ──────────────────────────────────────────────
    // ARCH-005: lib/types → 상위 레이어 금지
    // 기반 레이어는 어떤 상위 레이어도 import하면 안 됩니다.
    // ──────────────────────────────────────────────
    {
      name: 'lib-no-upper-layers',
      severity: 'error',
      comment:
        '[ARCH-005] lib/ 또는 types/ 에서 상위 레이어 import 금지. ' +
        '기반 레이어는 외부 의존성이 없어야 합니다. ' +
        '참고: docs/architecture.md',
      from: { path: '^src/(lib|types)' },
      to: { path: '^src/(app|features|components|hooks|services)' },
    },

    // ──────────────────────────────────────────────
    // ARCH-006: features 간 직접 import 금지
    // dependency-cruiser는 from/to 간 역참조(\1)를 지원하지 않으므로
    // 현재 도메인이 2개 이상일 때 수동으로 from/to 쌍을 추가하세요.
    // 예: from posts → to users
    // {
    //   name: 'no-cross-feature-posts-to-users',
    //   severity: 'warn',
    //   from: { path: '^src/features/posts/' },
    //   to:   { path: '^src/features/users/' },
    // },
    // ──────────────────────────────────────────────

    // ──────────────────────────────────────────────
    // 순환 의존성 금지 (모든 레이어)
    // ──────────────────────────────────────────────
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        '[CIRCULAR] 순환 import가 감지됐습니다. ' +
        '순환 의존성은 빌드 불안정과 테스트 어려움을 유발합니다. ' +
        '레이어 구조를 재검토하세요.',
      from: {},
      to: { circular: true },
    },
  ],

  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    moduleSystems: ['es6', 'cjs'],
    tsConfig: { fileName: 'tsconfig.json' },
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
    },
  },
};
