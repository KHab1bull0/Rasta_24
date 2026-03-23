import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppMode } from './shared/types/enums';

export function setupSwagger(app, appConfig: ConfigService) {
  if (appConfig.get<string>('app.mode') === AppMode.PROD) return;

  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
    },
    customCss: `
    .swagger-ui {
      margin-bottom: 300px;
    }
  `,
  };

  const config = new DocumentBuilder()
    .setTitle('Api Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, options);
}
