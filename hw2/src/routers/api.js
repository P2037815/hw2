const router = require('express').Router();
const modulesRouter = require('./tasks');

router.use('/modules', modulesRouter);

module.exports = router;
