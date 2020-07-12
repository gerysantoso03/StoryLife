const express = require('express');
const { ensureAuth, ensureGuest } = require('../middleware/authMiddlerawe');
const router = express.Router();

const Story = require('../models/Story');

// @desc    Login/Landing page
// @route   Get /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

// @desc    Dashboard
// @route   Get /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render('dashboard', {
      name: req.user.firstName,
      stories,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
