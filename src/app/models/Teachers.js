/* eslint-disable */
const db = require('../../config/db')
const { date } = require('../../lib/utils')

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
  }
}
