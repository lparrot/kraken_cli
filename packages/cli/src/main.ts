import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { GlobalExceptionFilter } from 'src/app/filters/global-exception.filter'

export async function appBootstrap(port?: number, callback?: () => void) {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/api')

  app.enableCors()
    const {httpAdapter} = app.get(HttpAdapterHost);
    app.useGlobalFilters(new GlobalExceptionFilter(app.get(HttpAdapterHost)))

  await app.listen(port ?? 9998, callback)
}

appBootstrap().then(value => {
  //
});
