exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('inspections', {
    id: "id",
    camis: { type: 'integer', notNull: true },
    inspection_date: { type: 'date', notNull: true },
    grade: { type: 'string' },
    score: { type: 'integer' },
    grade_date: { type: 'date' },
    record_date: { type: 'date' },
    inspection_type: { type: 'string' },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
  })
  pgm.createIndex('inspections', 'camis');
  pgm.createIndex('inspections', 'grade');
  pgm.createIndex('inspections', ['camis', 'grade']);
  pgm.createIndex('inspections', ['inspection_type', 'camis', 'inspection_date'], { unique: true });
};

exports.down = (pgm) => {

};
