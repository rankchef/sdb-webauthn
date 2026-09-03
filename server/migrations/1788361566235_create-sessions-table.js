export async function up(pgm) {
  pgm.createTable('sessions', {
    id: { type: 'varchar(255)', primaryKey: true },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    expires_at: { type: 'timestamp', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
}

export async function down(pgm) {
  pgm.dropTable('sessions');
}