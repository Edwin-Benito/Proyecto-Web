// @ts-nocheck
import { validationResult } from 'express-validator';
import { createErrorResponse } from '../utils/response.utils';

export const validateRequest = (req: any, res: any, next: any): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    res.status(400).json(createErrorResponse(errorMessages, errors.array()));
    return;
  }
  
  next();
};