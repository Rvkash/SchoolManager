/* eslint-disable */
const Student = require('../models/Student')
const { age, date } = require('../../lib/utils')
// req.query = id=?
// req.body = corpo
// req.params = /:id/members

// show //create //edit // put

module.exports = {
  index (req, res) {
    let { filter, page, limit} = req.query

    page = page || 1
    limit = limit || 2 
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(students) {
        
    const pagination = {
      total: Math.ceil(students[0].total / limit),
      page
    }

    return res.render("students/index", { students, pagination, filter })
    
    }
  }

    Student.paginate(params)
    
  },

  create (req, res) {
    
    Student.teachersSelectOptions(function (options) {
      return res.render('students/create', { teacherOptions: options })
    })
  },

  post (req, res) {
    // req.query  // req.body

    const keys = Object.keys(req.body)
    // req.body  {avatar_url: "http://avatarulr.com" "name": 123 etc...}
    for (key of keys) {
    // req.body.key == ""
      if (req.body[key] == '') {
        return res.send('Please, fill all fields ')
      }
    }

    Student.create(req.body, function (student) {
      return res.redirect(`/students/${student.id}`)
    })
  },

  show (req, res) {
    Student.find(req.params.id, function (student) {
      if (!student) return res.send('student not found')

      student.birth = date(student.birth).birthDay

      return res.render('students/show', { student })
    })
  },

  edit (req, res) {
    Student.find(req.params.id, function (student) {
      if (!student) return res.send('student not found')

      student.birth = date(student.birth).iso

      Student.teachersSelectOptions(function (options) {
        return res.render('students/edit', { student, teacherOptions: options })
      })
    })
  },

  put (req, res) {
    const keys = Object.keys(req.body)
    // req.body  {avatar_url: "http://avatarulr.com" "name": 123 etc...}
    for (key of keys) {
    // req.body.key == ""
      if (req.body[key] == '') {
        return res.send('Please, fill all fields ')
      }
    }

    Student.update(req.body, function () {
      return res.redirect(`students/${req.body.id}`)
    })
  },

  delete (req, res) {
    Student.delete(req.body.id, function () {
      return res.redirect('/students')
    })
  }
}
