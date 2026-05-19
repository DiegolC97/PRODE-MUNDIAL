import { randomUUID } from 'crypto';
import { IdGenerator } from '../../application/ports/IdGenerator';

export class UuidGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
