const updateGrades = async (pool) => {
  // Get latest grades for restaurants
  const result = await pool.query(
    `
      SELECT DISTINCT ON (restaurants_with_grade.id) * FROM (
        SELECT restaurants.id as id, restaurants.current_grade, inspections.grade, inspections.inspection_date
        FROM restaurants 
        JOIN inspections on restaurants.camis = inspections.camis
        ORDER BY inspections.inspection_date DESC
      ) AS restaurants_with_grade;
    `
  );
  // Update denormalized data only if there is a diff
  result.rows.forEach(async (row) => {
    if (row.current_grade !== row.grade) {
      console.info('Found restaurant id:', row.id, 'needs to be updated');
      await pool.query('UPDATE restaurants SET current_grade = $1 WHERE id = $2', [row.grade, row.id])
      console.info('finished updating id:', row.id)
    }
  });
};

module.exports = updateGrades;
