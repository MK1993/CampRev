const express = require('express')
var router = express.Router({mergeParams:true})
const {catchAsync} = require('../utils/catchAsync')
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')

router.post('/',isLoggedIn,validateReview,catchAsync(reviews.addReview))
  
router.delete('/:reviewId',isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router