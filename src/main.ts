import { formatErrorException } from "./common/utils/formatErrorException";
import { ValidationPipe } from "@nestjs/common";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform:true,
    exceptionFactory: (errors) => formatErrorException(errors),
  }));

  await app.listen(process.env.PORT || 3000);
}

bootstrap();