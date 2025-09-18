export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL = 'INTERNAL',
  CONFLICT = 'CONFLICT',
}

export enum SuccessType {
  OK = 'OK',
  CREATED = 'CREATED',
  NO_CONTENT = 'NO_CONTENT',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseCaseReponse<T = any> = {
  success: boolean;
  message: string;
  type?: ErrorType | SuccessType;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: null | string;
};

export function success<T>(
  data: T,
  message = 'Operation completed successfully',
  type: SuccessType,
): UseCaseReponse<T> {
  return {
    success: true,
    message,
    data,
    type: type,
  };
}

export function successOk<T>(
  data: T,
  message = 'Operation completed successfully',
): UseCaseReponse<T> {
  return {
    success: true,
    message,
    data,
    type: SuccessType.OK,
  };
}

export function successCreated<T>(
  data: T,
  message = 'Resource created successfully',
): UseCaseReponse<T> {
  return {
    success: true,
    message,
    data,
    type: SuccessType.CREATED,
  };
}

export function successNoContent<T>(
  message = 'Operation successful, no content to return',
): UseCaseReponse<T> {
  return {
    success: true,
    message,
    type: SuccessType.NO_CONTENT,
  };
}

export function failure(
  message = 'Operation failed',
  errorType: ErrorType,
  error: string | null = null,
): UseCaseReponse {
  return {
    success: false,
    type: errorType,
    message,
    error,
  };
}

export function failureValidation(
  message = 'Validation failed',
  error?: string | null,
): UseCaseReponse {
  return failure(message, ErrorType.VALIDATION, error);
}

export function failureNotFound(
  message = 'Resource not found',
): UseCaseReponse {
  return failure(message, ErrorType.NOT_FOUND);
}

export function failureUnauthorized(
  message = 'Unauthorized access',
): UseCaseReponse {
  return failure(message, ErrorType.UNAUTHORIZED);
}

export function failureForbidden(message = 'Forbidden access'): UseCaseReponse {
  return failure(message, ErrorType.FORBIDDEN);
}

export function failureInternal(
  message = 'An internal server error occurred',
): UseCaseReponse {
  return failure(message, ErrorType.INTERNAL);
}

export function failureConflict(message = 'Conflict'): UseCaseReponse {
  return failure(message, ErrorType.CONFLICT);
}
