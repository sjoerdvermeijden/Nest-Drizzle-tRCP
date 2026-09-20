import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AnyRouter } from '@trpc/server';
import { AppRouterHost } from 'nestjs-trpc';
import { generateOpenApiDocument } from 'trpc-to-openapi';

@Controller()
export class TrpcOpenApiController implements OnModuleInit {
  private appRouter!: AnyRouter;
  private openApiDocument!: ReturnType<typeof generateOpenApiDocument>;

  constructor(
    @Inject(AppRouterHost) private readonly appRouterHost: AppRouterHost,
  ) {}

  onModuleInit() {
    this.appRouter = this.appRouterHost.appRouter;

    this.openApiDocument = generateOpenApiDocument(this.appRouter, {
      title: 'My API',
      version: '1.0.0',
      baseUrl: 'http://localhost:3000/api',
    });
  }

  // Raw spec, e.g. for Postman/Insomnia import, or to feed into Swagger UI
  @Get('/openapi.json')
  getOpenApiJson() {
    return this.openApiDocument;
  }
}