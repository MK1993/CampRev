const mongoose = require('mongoose');
const Review = require('./reviews')

const Schema = mongoose.Schema

const ImageSchema = new Schema({
  path: String,
  filename: String 
})

ImageSchema.virtual('thumbnail').get(function () {
  return this.path.replace('/upload','/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  images:[ImageSchema],
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}, opts);

CampgroundSchema.virtual('properties.popupText').get(function () {
  return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})

CampgroundSchema.post('findOneAndDelete', async function(doc) {
  if(doc){
    await Review.deleteMany({
      _id: { $in: doc.reviews }
    })
  }
});


module.exports = mongoose.model('Camp', CampgroundSchema)