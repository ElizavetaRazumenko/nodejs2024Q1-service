import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavsService {
  constructor(private dbService: DatabaseService) {}
}
