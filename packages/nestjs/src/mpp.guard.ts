import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { mppConfig } from './mpp-config.js'

@Injectable()
export class MppGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('MPP ')) {
      response.setHeader(
        'WWW-Authenticate',
        \`MPP realm="api", method="tempo", params="recipient=\${mppConfig.recipient},currency=\${mppConfig.currency},amount=\${mppConfig.amount}"\`
      )
      throw new HttpException('Payment Required', HttpStatus.PAYMENT_REQUIRED)
    }

    return true
  }
}
