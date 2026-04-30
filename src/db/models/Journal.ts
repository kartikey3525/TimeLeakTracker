import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Journal extends Model {
  static table = 'journals';

  @field('text') text!: string;
  @field('image') image!: string;
  @field('created_at') createdAt!: number; // ✅ FIXED (no @date)
}
