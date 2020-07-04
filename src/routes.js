const express = require('express')
const routes = express.Router()
const teachers = require('./app/controllers/teachers')
const students = require('./app/controllers/students')

// http: verbs
// get: receber RESOURCE -> algo real
// post: Criar ou salva RESOURCE COM DADOS ENVIADOS
// put: atualizar um RESOURCE
// delete: apagar UM RESOURCE

routes.get('/', function (req, res) {
  return res.redirect('/teachers')
})

routes.get('/teachers', teachers.index)
routes.get('/teachers/create', teachers.create)
routes.get('/teachers/:id', teachers.show)
routes.get('/teachers/:id/edit', teachers.edit)
routes.post('/teachers', teachers.post) // mesmo caminho usando verbos diferentes
routes.put('/teachers', teachers.put) // mesmo caminho usando verbos diferentes
routes.delete('/teachers', teachers.delete)

routes.get('/students', students.index)
routes.get('/students/create', (req, res) => {
  return res.render('students/create')
})
routes.get('students/create', students.create)
routes.get('/students/:id', students.show)
routes.get('/students/:id/edit', students.edit)
routes.post('/students', students.post)
routes.put('/students', students.put)
routes.delete('/students', students.delete)

module.exports = routes
