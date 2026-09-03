export const up = pgm => {
  pgm.createTable('passkeys', {
    id: { type: 'text', primaryKey: true }, // Credential ID
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    public_key: { type: 'text', notNull: true },
    counter: { type: 'bigint', notNull: true },
    device_type: { type: 'varchar(50)', notNull: true },
    backed_up: { type: 'boolean', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = pgm => {
  pgm.dropTable('passkeys');
};