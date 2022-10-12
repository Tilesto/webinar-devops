const router = require('express').Router();
const {registerAdmin, authAdmin} = require('../controllers/admins');

router.post('/register', registerAdmin);
router.post('/auth', authAdmin);

module.exports = router;
