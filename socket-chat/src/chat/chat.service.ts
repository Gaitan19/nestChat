import { Injectable } from '@nestjs/common';

interface Client {
  id: string;
  name: string;
}

@Injectable()
export class ChatService {
  private clients;
}
