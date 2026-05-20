import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Journal extends Model {
  static table = 'journals';

  @field('task_id') taskId!: string;
  @field('task_title') taskTitle!: string;
  @field('text') text!: string;
  @field('image') image!: string;
  @field('created_at') createdAt!: number; // ✅ FIXED (no @date)
}
