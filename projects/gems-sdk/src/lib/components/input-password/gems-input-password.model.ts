/** Critérios da política de senha que o valor atual **não** satisfaz. */
export interface GemsPasswordPolicyErrors {
  minLength?: true;
  lowercase?: true;
  uppercase?: true;
  specialCharacter?: true;
  noWhitespace?: true;
}

/** Coincidências entre a senha e a identidade do usuário. */
export interface GemsPasswordIdentityErrors {
  username?: true;
  email?: true;
}

/** Um critério da política, com a mensagem que o componente exibe quando ele está pendente. */
export interface GemsPasswordCriterion {
  key: string;
  message: string;
  valid: boolean;
}

/** Tamanho mínimo exigido pela política do componente. */
export const GEMS_PASSWORD_MINIMUM_LENGTH = 12;

/** Caracteres especiais aceitos pela política do componente. */
export const GEMS_PASSWORD_SPECIAL_CHARACTER_PATTERN = /[@#$%^&+=!]/;
