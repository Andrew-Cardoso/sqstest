import { Controller, Get } from '@nestjs/common';
import { SqsService } from './sqs.service';

@Controller('sqs')
export class SqsController {
  constructor(private service: SqsService) {}
  @Get('send')
  sendMessage() {
    return this.service.sendMessage();
  }

  @Get()
  readMessage() {
    return this.service.getNext();
  }
}
