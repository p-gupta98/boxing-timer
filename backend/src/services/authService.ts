import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../repositories/userRepo';
import { User } from '../types/user';
import { DuplicateEmailError, InvalidCredentialsError } from '../types/errors';

const SALT_ROUNDS = 10;

export async function signUp(name: string, email: string, password: string): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();            
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    return await createUser(name, normalizedEmail, passwordHash);
  } catch (err: any) {
    if (err.code === '23505') {             // Postgres unique-violation code
      throw new DuplicateEmailError();
    }
    throw err;
  }
}

export async function login(email: string, password: string): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);
  if (!user) throw new InvalidCredentialsError();

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new InvalidCredentialsError();

  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}