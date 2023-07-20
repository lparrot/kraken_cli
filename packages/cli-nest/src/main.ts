import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';

export async function appBootstrap(port?: number, callback?: () => void) {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api')
  app.enableCors();

  await app.listen(port ?? 9998, callback);
}

appBootstrap().then(value => {
  //
});
