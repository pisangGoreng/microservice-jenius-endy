import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { Observable } from 'rxjs';

@Injectable()
export class RegisterGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const data = context.switchToRpc().getData();
    // return Number(data.userId) === data.user.id;


    return false
  }

}