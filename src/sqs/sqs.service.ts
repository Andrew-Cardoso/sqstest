import { Injectable, OnModuleInit } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';

const queueUrl = 'http://localhost:4566/000000000000/test';

@Injectable()
export class SqsService implements OnModuleInit {
  constructor(@InjectAwsService(SQS) private readonly sqs: SQS) {}

  onModuleInit() {
    this.sqs.listQueues((err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const queue = data?.QueueUrls?.[0];
      if (queue) {
        console.log(queue);
        return;
      }

      this.sqs.createQueue({ QueueName: 'test' }, (err, data) =>
        console.log(err ?? data),
      );
    });
  }
  async sendMessage() {
    return await new Promise((res, rej) => {
      this.sqs.sendMessage(
        {
          MessageBody: JSON.stringify({
            numeroAleatorio: Math.round(Math.random() * 10),
          }),
          QueueUrl: queueUrl,
        },
        (err, data) => (err ? rej(err) : res(data)),
      );
    });
  }

  async getNext() {
    return await new Promise((res, rej) => {
      this.sqs.receiveMessage(
        { QueueUrl: queueUrl, MaxNumberOfMessages: 1 },
        (err, data) => {
          if (err) return rej(err);
          if (!data.Messages?.length) return res('no new Messages');

          this.sqs.deleteMessage(
            {
              QueueUrl: queueUrl,
              ReceiptHandle: data.Messages[0].ReceiptHandle,
            },
            () => res(data.Messages[0].Body),
          );
        },
      );
    });
  }
}
