export class DuplicateEmailError extends Error {
  constructor() {
    super('Email already registered');
    this.name = 'DuplicateEmailError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}