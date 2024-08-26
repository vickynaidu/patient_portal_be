import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { CustomIoAdapter } from './CustomIoAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Apply the MetricsInterceptor globally
  app.useGlobalInterceptors(new MetricsInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Patient Portal')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  // Apply the custom WebSocket adapter
  app.useWebSocketAdapter(new CustomIoAdapter(app));

  // Enable CORS for HTTP requests
  app.enableCors({
    origin: '*', // Replace with your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(5000);
}

bootstrap();