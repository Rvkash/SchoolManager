/* eslint-disable */
const db = require('../../config/db')
const { date } = require('../../lib/utils')
const teachers = require('../controllers/teachers')

module.exports = {
  all (callback) {

    // listando estudantes na aba professores, DESC = quem possue mais ficar em cima
    db.query(`
    SELECT teachers.*, count(students)  AS total_students
    FROM teachers
    LEFT JOIN students ON (teachers.id = students.teacher_id)
    GROUP BY teachers.id
    ORDER BY total_students DESC`, function (err, results) {
      if (err) throw `Database erro! ${err}`
      callback(results.rows)
    })
  },
  create (data, callback) {
    const query = `
    INSERT INTO teachers (
      avatar_url,
      name,
      gender,
      services,
      birth,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
  `

    const values = [
      data.name,
      data.avatar_url,
      data.gender,
      data.services,
      date(data.birth).iso,
      date(Date.now()).iso

    ]

    db.query(query, values, function (err, results) {
            if (err) throw `Database erro ${err}`


      callback(results.rows[0])
    })
  },
  find (id, callback) {
    db.query(`
       SELECT * 
       FROM teachers 
       WHERE id = $1`, [id], function (err, results) {
                if (err) throw `Database erro ${err}`

          callback(results.rows[0])
    })
  },
  findBy(filter, callback) {
    db.query(`
    SELECT teachers.*, count(students)  AS total_students
    FROM teachers
    LEFT JOIN students ON (teachers.id = students.teacher_id)
    WHERE teachers.name ILIKE  '%${filter}%'
    OR teachers.services ILIKE '%${filter}%'
    GROUP BY teachers.id
    ORDER BY total_students DESC`, function (err, results) {
      if (err) throw `Database erro! ${err}`
      callback(results.rows)
    })
  },
  update(data, callback) {
    const query = `
      UPDATE teachers SET 
        avatar_url = ($1),
        name = ($2),
        birth = ($3),
        gender = ($4),
        services = ($5)
      WHERE id = $6    
    `

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.services,
      data.id
    ]

    db.query(query, values, function (err, results, ) {
            if (err) throw `Database erro ${err}`


      callback()

    })
  },
  delete(id, callback) {
    db.query(`DELETE FROM teachers WHERE id = $1`, [id], function (err, results) {
      if (err) throw `Database erro ${err}`
       
      return callback()
    })
  },
  paginate(params) {
    const { filter, limit, offset, callback} = params

    let query = "",
      filterQuery = "",
      totalQuery = `(
        SELECT count(*) FROM teachers
      )  AS total`
    

  if (filter) {
    filterQuery = `
      WHERE teachers.name ILIKE '%${filter}%'
      OR teachers.services ILIKE '%${filter}%'
      `

    totalQuery = `(
      SELECT count(*) FROM teachers
      ${filterQuery}
      ) as total`
  }

    query = `
      SELECT teachers.*, ${totalQuery}, count(students) as total_students
      FROM teachers
      LEFT JOIN students ON (teachers.id = students.teacher_id)
      ${filterQuery}  
      GROUP BY teachers.id LIMIT $1 OFFSET $2
      `

    db.query(query, [limit, offset], function(err, results) {
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  }
}
