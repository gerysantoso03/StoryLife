const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with Google
// @route   Get /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc    Auth with Google Callback
// @route   Get /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// @desc    Logout
// @route Get /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
