exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('restaurants', {
    id: "id",
    CAMIS: { type: 'integer', notNull: true },
    name: { type: 'string', notNull: true },
    address: { type: 'string' },
    zipcode: { type: 'string' },
    phone: { type: 'string' },
    cuisine_type: { type: 'string' },
    current_grade: { type: 'string' },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
  })
  pgm.createIndex('restaurants', 'CAMIS', { unique: true });
  pgm.createIndex('restaurants', 'cuisine_type');
  pgm.createIndex('restaurants', 'current_grade');
  pgm.createIndex('restaurants', ['cuisine_type', 'current_grade']);
};

exports.down = (pgm) => {

};
