import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { mapKeys, snakeCase } from 'lodash'

@Injectable()
export class RegisterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) => {
          const parsedData = JSON.parse(JSON.stringify(data))

          if (parsedData.status === HttpStatus.CONFLICT) {
            return {
              status_code: context.switchToHttp().getResponse().statusCode,
              message: parsedData.message,
              data: null
            }
          }

          delete parsedData.__v
          delete parsedData.password
          delete parsedData.createdAt
          delete parsedData.updatedAt

          const serializeData = mapKeys(parsedData, (value, key) => snakeCase(key));

          return {
            status_code: context.switchToHttp().getResponse().statusCode,
            message: 'success create new user',
            data: serializeData
          }
        }))
  }
}

@Injectable()
export class LoginInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((response) => {
          return {
            status_code: context.switchToHttp().getResponse().statusCode,
            message: response.message,
            data: response.data
          }
        }))
  }
}



