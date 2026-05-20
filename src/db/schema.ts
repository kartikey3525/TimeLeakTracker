import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'journals',
      columns: [
        { name: 'task_id', type: 'string' },
        { name: 'task_title', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'image', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
