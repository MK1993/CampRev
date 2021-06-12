const ExpressError = require('./utils/ExpressError')
const {campSchema} = require('./schema')
const Campground = require('./models/campground')
const {reviewSchema} = require('./schema')
const Review = require('./models/reviews')

module.exports.isLoggedIn= (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl
        req.flash('error',"You're not logged in!")
        return res.redirect("/login")
    }
    next();
}

module.exports.validateCampground= (req,res,next) => {
    const {error} = campSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg,400)
    } else {
        next()
    }
}

module.exports.isAuthor= async (req,res,next) => {
    const {id}=req.params
    const camp = await Campground.findById(id)
    if(!camp.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that!");
        res.redirect(`/campgrounds/${id}`)
    }
    else {
        next ()
    }
}

module.exports.isReviewAuthor= async (req,res,next) => {
    const {id,reviewId} = req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that!");
        res.redirect(`/campgrounds/${id}`)
    }
    else {
        next ()
    }
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error) {
      const msg = error.details.map(el => el.message).join(",")
      throw new ExpressError(msg,400)
    } else {
      next()
    }
}