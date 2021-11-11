const database = require('../database/database');
const createHttpError = require('http-errors');

const router = require('express').Router();

router.get('/', function (req, res, next) {
  return database.query(`SELECT * FROM todos_list ORDER BY id;`, [], function (error, result) {
    if (error) {
      return next(error);
    }
    const todos = [];
    for (let i = 0; i < result.rows.length; i++) {
      const todo = result.rows[i];
      todos.push({
        id: todo.id,
        task: todo.task,
        //moduleCredit: module.module_credit,
        status: todo.status,
      });
    }
    return res.json({ todos: todos });
  });
});

router.post('/', function (req, res, next) {
  const task = req.body.task;
  //const moduleCredit = req.body.moduleCredit;
  return database.query(
    `INSERT INTO todos_list (task) VALUES ($1)`,
    [task],
    function (error) {
      if (error && error.code === '23505') {
        return next(createHttpError(400, `Module ${task} already exists`));
      } else if (error) {
        return next(error);
      }
      return res.sendStatus(201);
    },
  );
});

router.put('/:task', function (req, res, next) {
  const status = req.body.status;
  const task = req.params.task;
  // TODO: Use Parameterized query instead of string concatenation
  //return database.query(`UPDATE modules_tab SET grade = '${grade}' WHERE module_code = '${moduleCode}'`, [], function (
    return database.query(`UPDATE todos_list SET status = $1 WHERE task = $2`, [status, task], function (
    error,
    result,
  ) {
    if (error) {
      return next(error);
    }
    if (result.rowCount === 0) {
      return next(createHttpError(404, `No such Task: ${task}`));
    }
    return res.sendStatus(200);
  });
});

router.delete('/:task', function (req, res, next) {
  const task = req.params.task;
  console.log(task);
  // TODO: Use Parameterized query instead of string concatenation
  //return database.query(`DELETE FROM modules_tab WHERE module_code = '${moduleCode}'`, [], function (error, result) {
    return database.query(`DELETE FROM todos_list WHERE task = $1`, [task], function (error, result) {
    if (error) {
      return next(error);
    }
    return res.sendStatus(200);
  });
});

module.exports = router;
