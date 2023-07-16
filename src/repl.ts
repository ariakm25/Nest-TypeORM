import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await repl(AppModule);
}

bootstrap()
  .then(() => {
    console.log('Repl started');
  })
  .catch((err) => {
    console.error('Repl err', err);
  });
