const Campground = require('../models/campground')
const Review = require('../models/reviews')

module.exports.addReview = async (req,res)=>{
    const {id} =req.params
    const camp =await Campground.findById(id)
    const review =new Review(req.body.review)
    review.author = req.user._id
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    req.flash('success', 'Successfully added review!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteReview = async (req,res)=>{
    const {id,reviewId} = req.params
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews : reviewId }})
    await Review.findByIdAndRemove(reviewId)
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${camp._id}`)
}