import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  error: string;
  details?: any;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let error = 'INTERNAL_SERVER_ERROR';
    let details: any = null;

    // Handle HttpException
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responseData = exception.getResponse();

      if (typeof responseData === 'object') {
        const exceptionResponse = responseData as any;
        message = exceptionResponse.message || exception.message;
        error = exceptionResponse.error || 'HTTP_EXCEPTION';
        details = exceptionResponse;
      } else {
        message = responseData.toString();
        error = 'HTTP_EXCEPTION';
      }
    }
    // Handle other errors
    else if (exception instanceof Error) {
      message = exception.message || 'Unknown Error';
      error = exception.name || 'ERROR';
      details = {
        stack: exception.stack,
        cause: exception.cause,
      };
    } else {
      message = String(exception);
      error = 'UNKNOWN_ERROR';
      details = exception;
    }

    const errorResponse: ErrorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error,
      ...(details && { details }),
    };

    // Log the complete error for debugging
    this.logger.error(
      `[${request.method}] ${request.url} - ${statusCode}`,
      {
        message,
        error,
        details,
        stack: exception instanceof Error ? exception.stack : undefined,
        body: request.body,
      },
    );

    response.status(statusCode).json(errorResponse);
  }
}
