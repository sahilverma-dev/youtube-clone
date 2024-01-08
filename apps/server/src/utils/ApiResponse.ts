export class ApiResponse {
  statusCode: number;
  success: boolean;
  data: unknown;
  message: string;

  constructor(statusCode: number, message: string, data?: unknown) {
    this.statusCode = statusCode;
    this.data = data || null; // Use the provided data or set it to null if not provided
    this.message = message;
    this.success = statusCode < 400;
  }
}
