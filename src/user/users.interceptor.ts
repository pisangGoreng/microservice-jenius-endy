import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { mapKeys, snakeCase } from 'lodash'

@Injectable()
export class FindInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) => {
          const parsedData = JSON.parse(JSON.stringify(data))

          const serializeData = parsedData.map(data => {
            delete data.__v
            delete data.password
            delete data.createdAt
            delete data.updatedAt

            return mapKeys(data, (value, key) => snakeCase(key));
          })

          return {
            status_code: context.switchToHttp().getResponse().statusCode,
            message: 'ok',
            data: serializeData
          }
        }))
  }
}


export class FindOneInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) => {
          const parsedData = JSON.parse(JSON.stringify(data))

          delete parsedData.__v
          delete parsedData.password
          delete parsedData.createdAt
          delete parsedData.updatedAt

          const serializeData = mapKeys(parsedData, (value, key) => snakeCase(key));

          return {
            status_code: context.switchToHttp().getResponse().statusCode,
            message: 'ok',
            data: serializeData
          }
        }))
  }
}
export class DeleteInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) => {
          const parsedData = JSON.parse(JSON.stringify(data))

          return {
            status_code: context.switchToHttp().getResponse().statusCode,
            message: 'ok',
            data: {
              deleted_count: parsedData.deletedCount
            }
          }
        }))
  }
}