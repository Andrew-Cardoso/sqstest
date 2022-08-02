import { Module } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        endpoint: 'http://localhost:4566/',
        region: 'us-east-1',
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
      },
      services: [SQS],
    }),
    SqsModule,
  ],
})
export class AppModule {}
