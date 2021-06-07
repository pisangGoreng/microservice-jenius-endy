import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { mapKeys, snakeCase } from 'lodash'
@Injectable()
export class FindInterceptor implements NestInterceptor {
  serialize (data) {
    delete data.__v
    delete data.password
    delete data.createdAt
    delete data.updatedAt

    return mapKeys(data, (value, key) => snakeCase(key));
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) => {
          if (data === null) ({
            status_code: context.switchToHttp().getResponse().statusCode,
            message: 'user not found',
            data: null
          })

          const parsedData = JSON.parse(JSON.stringify(data))
          let serializeData = null

          if(typeof data.length === 'undefined') {
            serializeData = this.serialize(parsedData)
          }

          if (data.length) {
            serializeData = parsedData.map(data => this.serialize(data))
          }

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