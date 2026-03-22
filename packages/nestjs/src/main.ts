import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = parseInt(process.env.PORT ?? '3006')
  await app.listen(port)
  console.log(\`NestJS server running at http://localhost:\${port}\`)
}
bootstrap()
