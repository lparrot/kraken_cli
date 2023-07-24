import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common'
import {HttpAdapterHost} from '@nestjs/core'
import {getStack} from 'src/utils/error.utils'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    }

    catch(exception: Error, host: ArgumentsHost): void {
        const {httpAdapter} = this.httpAdapterHost

        const ctx = host.switchToHttp()

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        const responseBody = {
            success: false,
            statusCode: httpStatus,
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            message: exception.message != null ? exception.message : exception,
            stack: getStack(exception)
        }

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
    }
}
