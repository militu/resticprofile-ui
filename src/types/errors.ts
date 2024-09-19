import { ActionResponse } from ".";

// Base error class for custom errors
class BaseError extends Error {
  statusCode: number;
  static statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// New custom exceptions
class ParseError extends BaseError {
  static statusCode = 400; // Bad Request

  constructor(message: string, public rawOutput: string) {
    super(message, ParseError.statusCode);
  }
}

class UnknownCommandError extends BaseError {
  static statusCode = 400; // Bad Request

  constructor(message: string) {
    super(message, UnknownCommandError.statusCode);
  }
}

class SSHError extends BaseError {
  static statusCode = 500; // Internal Server Error

  constructor(message: string, public readonly code?: string) {
    super(message, SSHError.statusCode);
  }
}

class SSHCommandExecutionError extends BaseError {
  static statusCode = 500; // Internal Server Error

  constructor(
    public readonly exitCode: number,
    public readonly errorOutput: string,
    public readonly standardOutput: string
  ) {
    super(
      `Command failed with exit code ${exitCode}`,
      SSHCommandExecutionError.statusCode
    );
    this.name = "CommandExecutionError";
  }
}

// Specific error classes
class AuthError extends BaseError {
  static statusCode = 401; // Unauthorized

  constructor(message: string) {
    super(message, AuthError.statusCode);
  }
}

class DuplicateSlugError extends BaseError {
  static statusCode = 409; // Conflict

  constructor(message: string) {
    super(message, DuplicateSlugError.statusCode);
  }
}

class ResourceNotFoundError extends BaseError {
  static statusCode = 404; // Not Found

  constructor(resource: string, identifier: string) {
    super(
      `${resource} with identifier ${identifier} not found`,
      ResourceNotFoundError.statusCode
    );
  }
}

class ValidationError extends BaseError {
  static statusCode = 400; // Bad Request

  constructor(message: string) {
    super(message, ValidationError.statusCode);
  }
}

class UnexpectedError extends BaseError {
  static statusCode = 500; // Internal Server Error

  constructor(originalError: unknown) {
    super("An unexpected error occurred", UnexpectedError.statusCode);
    this.cause = originalError;
  }
}

// Type guard for custom errors
function isCustomError(error: unknown): error is BaseError {
  return error instanceof BaseError;
}

function handleActionError(error: unknown): ActionResponse<never> {
  if (isCustomError(error)) {
    return {
      success: false,
      error: `${error.name}: ${error.message}`,
      errorName: error.name,
      errorStack: error.stack,
      statusCode: error.statusCode,
    };
  }

  console.error("Unexpected error:", error);
  return {
    success: false,
    error: "An unexpected error occurred",
    statusCode: 500,
  };
}

export {
  AuthError,
  BaseError,
  DuplicateSlugError,
  handleActionError,
  ParseError,
  ResourceNotFoundError,
  SSHCommandExecutionError,
  SSHError,
  UnexpectedError,
  UnknownCommandError,
  ValidationError,
};
