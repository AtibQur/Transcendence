import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(
    session({
      name: 'session',
      secret: 'wow-such-secret-much-security',
      resave: false,
      saveUninitialized: false,
      cookie: { 
        maxAge: 6000000,
      },
    })
  )

  app.enableCors( {
	origin: ['http://localhost:8080']
  });
  await app.listen(3000);
}
bootstrap();