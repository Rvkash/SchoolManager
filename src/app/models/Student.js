/* eslint-disable */
const db = require('../../config/db')
const { date } = require('../../lib/utils')


module.exports = {
  all (callback) {
    db.query(`SELECT * FROM students`, function (err, results) {
      if (err) throw `Database erro! ${err}`
      callback(results.rows)
    })
  },
  create (data, callback) {
    const query = `
    INSERT INTO students (
      name,
      avatar_url,
      gender,
      email,
      birth,
      blood,
      weight,
      height,
      teacher_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
  `

    const values = [
      data.name,
      data.avatar_url,
      data.gender,
      data.email,
      date(data.birth).iso,
      data.blood,
      data.weight,
      data.height,
      data.teacher


    ]

    db.query(query, values, function (err, results) {
            if (err) throw `Database erro ${err}`


      callback(results.rows[0])
    })
  },
  find (id, callback) {
    db.query(`
       SELECT students.*, teachers.name AS teacher_name 
       FROM students 
       LEFT JOIN teachers ON (students.teacher_id = teachers.id)
       WHERE students.id = $1`, [id], function (err, results) {
                if (err) throw `Database erro ${err}`

          callback(results.rows[0])
    })
  },
  update(data, callback) {
    const query = `
      UPDATE students SET 
        avatar_url = ($1),
        name = ($2),
        birth = ($3),
        gender = ($4),
        email = ($5),
        blood = ($6),
        weight = ($7),
        height = ($8),
        teacher_id = ($9)
      WHERE id = $10
    `

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.email,
      data.blood,
      data.weight,
      data.height,
      data.teacher,

      data.id
    ]

    db.query(query, values, function (err, results, ) {
            if (err) throw `Database erro ${err}`


      callback()

    })
  },
  delete(id, callback) {
    db.query(`DELETE FROM students WHERE id = $1`, [id], function (err, results) {
      if (err) throw `Database erro ${err}`
       
      return callback()
    })
  },
  teachersSelectOptions(callback) {
    db.query(`SELECT name, id FROM teachers`, function(err, results){
      if(err) throw `Database error!`

      callback(results.rows)
    })
  },
  paginate(params) {
    const { filter, limit, offset, callback} = params

    let query = "",
      filterQuery = "",
      totalQuery = `(
        SELECT count(*) FROM students
      )  AS total`
    

  if (filter) {
    filterQuery = `
      WHERE students.name ILIKE '%${filter}%'
      OR students.email ILIKE '%${filter}%'
      `

    totalQuery = `(
      SELECT count(*) FROM students
      ${filterQuery}
      ) as total`
  }

    query = `
      SELECT students.*, ${totalQuery}
      FROM students
      ${filterQuery}  
      LIMIT $1 OFFSET $2
      `

    db.query(query, [limit, offset], function(err, results) {
      if (err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  }
}
