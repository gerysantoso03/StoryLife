const express = require('express');
const { ensureAuth } = require('../middleware/authMiddlerawe');
const router = express.Router();

const Story = require('../models/Story');

// @desc    Show Add Story Page
// @route   Get /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/addStories');
});

// @desc    Show All Story Page
// @route   Get /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc    Show Edit Story Page
// @route   Get /stories/edit/id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  }).lean();

  if (!story) {
    res.redirect('/stories');
  }

  if (story.user != req.user.id) {
    res.redirect('/stories');
  } else {
    res.render('stories/editStories', {
      story,
    });
  }
});

// @desc    Show single Story Page
// @route   Get /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean();

    if (!story) {
      res.redirect('/dashboard');
    }

    res.render('stories/showStories', {
      story,
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc    Show User Story
// @route   Get /stories/user/:id
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();

    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc    Proccess Adding Story
// @route   Post /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;

    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
  }
});

// @desc    Proccess Edit Story
// @route   Put /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      res.redirect('/stories');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect('/dashboard');
    }
  } catch (err) {
    console.log(err);
  }
});

// @desc    Delete Story
// @route   Get /stories/delete/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
