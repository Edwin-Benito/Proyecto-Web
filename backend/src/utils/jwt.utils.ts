import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { JWTPayload } from '../types';

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(
    payload as object,
    config.JWT_SECRET as string,
    { expiresIn: config.JWT_EXPIRES_IN as string } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.JWT_SECRET as string) as JWTPayload;
};