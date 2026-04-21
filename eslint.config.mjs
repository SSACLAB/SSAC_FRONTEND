import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = [
  // Next.js 16 native flat config (no FlatCompat needed)
  ...nextCoreWebVitals,
  ...nextTypescript,

  // Prettier: disable formatting rules that conflict with prettier
  prettierConfig,

  // ──────────────────────────────────────────────────────────
  // RULE 1: any 타입 금지
  // FIX: unknown + 타입 가드 사용. 예) const d: unknown = ...; if (typeof d === 'object') {}
  // ──────────────────────────────────────────────────────────
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // ──────────────────────────────────────────────────────────
  // RULE 2: app/ → services/ 직접 import 금지 [ARCH-001]
  // FIX: features/<domain>/ 컴포넌트를 경유하세요. docs/architecture.md 참고
  // 예외: src/app/api/ Route Handler는 BFF 레이어이므로 services/ 직접 사용 허용.
  // ──────────────────────────────────────────────────────────
  {
    files: ['src/app/**/*.{ts,tsx}'],
    ignores: ['src/app/api/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/services', '@/services/*'],
              message:
                '[ARCH-001][FIX] app/ → services/ 직접 import 금지. ' +
                'features/<domain>/ 컴포넌트를 통해 데이터를 받으세요.',
            },
          ],
        },
      ],
    },
  },

  // ──────────────────────────────────────────────────────────
  // RULE 3: components/ → services|features import 금지 [ARCH-002, ARCH-003]
  // FIX: 데이터를 Props로 받도록 컴포넌트를 재설계하세요.
  // ──────────────────────────────────────────────────────────
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/services', '@/services/*'],
              message: '[ARCH-002][FIX] components/ → services/ 금지. Props로 데이터를 받으세요.',
            },
            {
              group: ['@/features', '@/features/*'],
              message:
                '[ARCH-003][FIX] components/ → features/ 금지. 공통 컴포넌트는 도메인에 의존하지 않아야 합니다.',
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
