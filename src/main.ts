import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule } from '@nestjs/swagger';
import { TrpcOpenApiController } from './openapi/trpc-openapi.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const controller = app.get(TrpcOpenApiController);
  SwaggerModule.setup('docs', app, () => controller.getOpenApiJson() as any);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
