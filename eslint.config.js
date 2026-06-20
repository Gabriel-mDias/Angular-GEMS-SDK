// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Proíbe qualquer 'any' — use tipos concretos ou generics
      '@typescript-eslint/no-explicit-any': 'error',
      // Proíbe variáveis/imports declarados mas não utilizados
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Padrão de seletor de componentes: prefixo 'gems', kebab-case
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'gems', style: 'kebab-case' },
      ],
      // Padrão de seletor de diretivas: prefixo 'gems', camelCase
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'gems', style: 'camelCase' },
      ],
      // Proíbe template inline no @Component (obriga templateUrl)
      '@angular-eslint/prefer-standalone': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // Proíbe *ngIf, *ngFor, *ngSwitch — use @if, @for, @switch
      '@angular-eslint/template/prefer-control-flow': 'error',
      // Acessibilidade: todo img precisa de alt
      '@angular-eslint/template/alt-text': 'error',
      // Acessibilidade: label deve estar associado a um controle
      '@angular-eslint/template/label-has-associated-control': 'error',
    },
  },
);
