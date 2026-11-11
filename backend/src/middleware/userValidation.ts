import { Request, Response, NextFunction } from 'express';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({message: 'Email is required'});
  }

  if (typeof password !== 'string' || password === '') {
    return res.status(400).json({message: 'Password is required'});
  }

  next();

}

export function validateSignup(req: Request, res:Response, next: NextFunction) {
  const { name, email, password } = req.body ?? {};

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({message: 'Name is required'});
  }

  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({message: 'Email is required'});
  }

  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({ message: 'Email format is invalid' });
  }

  if (typeof password !== 'string' || password === '') {
    return res.status(400).json({message: 'Password is required'});
  }

  if (password.length < 8) {
    return res.status(400).json({message: 'Password must be at least 8 characters'});
  }

  next();  
}