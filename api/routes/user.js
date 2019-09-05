const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/checkauth');
const user = require('../controllers/user');

router.post("/auth/facebook", user.facebook_auth);

router.post('/auth/me', checkAuth, user.get_single_user);

module.exports = router;