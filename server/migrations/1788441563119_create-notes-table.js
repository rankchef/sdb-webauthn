/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export async function up(pgm) {
  pgm.createTable('notes', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    title: {
      type: 'varchar(255)',
      notNull: true,
    },
    content: {
      type: 'text',
      notNull: false,
    },
    is_archived: {
      type: 'boolean',
      default: false,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('notes', 'user_id');
}

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export async function down(pgm) {
  pgm.dropTable('notes');
}