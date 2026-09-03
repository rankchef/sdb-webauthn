export const up = pgm => {
  pgm.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    username: { type: 'varchar(255)', notNull: true, unique: true },
    current_challenge: { type: 'text', default: null },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = pgm => {
  pgm.dropTable('users');
};