const batchInsert = require('../../db/batchInsert');

describe('batchInsert', () => {
  let pool;

  beforeEach(() => {
    pool = { query: jest.fn() };
  });

  it('should create the right query', () => {
    batchInsert({
      pool,
      tableName: 'marvel_heroes',
      columnNames: ['id', 'name', 'power'],
      batchValues: [[1, 'The Hulk', 'Green'], [2, 'Thor', 'Hammer Time']]
    });
    expect(pool.query).toBeCalledWith(
      "INSERT INTO marvel_heroes (id,name,power) VALUES ('1', 'The Hulk', 'Green'), ('2', 'Thor', 'Hammer Time') "
    );
  });

  it('should pass the additionalQuery to the query', () => {
    batchInsert({
      pool,
      tableName: 'marvel_heroes',
      columnNames: ['id'],
      batchValues: [[1]],
      additionalQuery: 'ON CONFLICT (id) DO NOTHING'
    });
    expect(pool.query).toBeCalledWith(
      "INSERT INTO marvel_heroes (id) VALUES ('1') ON CONFLICT (id) DO NOTHING"
    );
  });
});
