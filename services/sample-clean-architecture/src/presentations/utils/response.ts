import type { Response } from 'express';

// Common API response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  httpStatus?: number;
}

// Successful API response interface
export interface SuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
  error?: never;
}

// Errored API response interface
export interface ErrorResponse extends ApiResponse {
  success: false;
  data?: never;
  error?: string;
}

// Paginated API response interface
export interface PaginatedResponse<T = unknown> extends SuccessResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Success response helper
export function sendSuccess<T>(res: Response, data: T, message = ' Success', httpStatus = 200) {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
    httpStatus,
  };

  return res.status(httpStatus).json(response);
}

// Created response helper
export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Created successfully',
  httpStatus = 201,
) {
  return sendSuccess(res, data, message, httpStatus);
}

// Updated response helper
export function sendUpdated<T>(
  res: Response,
  data: T,
  message = 'Updated successfully',
  httpStatus = 200,
) {
  return sendSuccess(res, data, message, httpStatus);
}

// Deleted response helper
export function sendDeleted<T>(
  res: Response,
  message = 'Deleted successfully',
  data?: T,
  httpStatus = 200,
) {
  return sendSuccess(res, data, message, httpStatus);
}

// Error response helper
export function sendError(res: Response, message: string, httpStatus = 400, error?: string) {
  const response: ErrorResponse = {
    success: false,
    message,
    error: error ?? message,
  };

  return res.status(httpStatus).json(response);
}

// Not found response helper
export function sendNotFound(res: Response, message = 'Not found', httpStatus = 404) {
  return sendError(res, message, httpStatus);
}

// Unauthorized response helper
export function sendUnauthorized(res: Response, message = 'Unauthorized access', httpStatus = 401) {
  return sendError(res, message, httpStatus);
}

// Forbidden response helper
export function sendForbidden(res: Response, message = 'Forbidden access', httpStatus = 403) {
  return sendError(res, message, httpStatus);
}

// Internal server error response helper
export function sendServerError(res: Response, message = 'Unexpected error', httpStatus = 500) {
  return sendError(res, message, httpStatus);
}
