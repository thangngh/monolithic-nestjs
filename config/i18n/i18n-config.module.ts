import { Module } from '@nestjs/common';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // I18nModule.forRoot({
    //   fallbackLanguage: 'en',
    //   loaderOptions: {
    //     path: path.join(process.cwd(), 'i18n'),
    //     watch: true,
    //   },
    // }),
    I18nModule.forRootAsync({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage:
          'en' /**configService.getOrThrow('FALLBACK_LANGUAGE')*/,
        loaderOptions: {
          path: path.join(process.cwd(), '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class I18nConfigModule {}
