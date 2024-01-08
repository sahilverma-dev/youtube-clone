export class ApiError extends Error {
  statusCode: number;
  errors: string[];
  success: boolean;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: string[] = [],
    stack: string = ""
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
