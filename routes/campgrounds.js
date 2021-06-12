const express = require('express')
const router = express.Router()
const {catchAsync} = require('../utils/catchAsync')
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage: storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.addCamp))

router.get('/new', isLoggedIn,campgrounds.newCamp)
  
router.route('/:id')
    .get(catchAsync(campgrounds.findCamp))
    .put(isAuthor,upload.array('image'),validateCampground, catchAsync(campgrounds.putCamp))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.destroyCamp))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.editCamp))

module.exports = router