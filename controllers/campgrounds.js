const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req,res)=>{
    const campF = await Campground.find({});
    res.render('campground/index', {campF})
}

module.exports.newCamp = (req,res)=>{
    res.render('campground/new')
}

module.exports.addCamp = async (req,res)=>{
    const {campground} = req.body
    const geoData= await geocodingClient
    .forwardGeocode({
        query: campground.location
    })
    .send()
    campground.images = req.files.map(f=>({path:f.path,filename:f.filename}));
    campground.author = req.user._id
    campground.geometry = geoData.body.features[0].geometry
    const camp = new Campground(campground)
    await camp.save();
    req.flash('success', 'Successfully added campground!');
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.findCamp = async (req,res)=>{
    const {id}=req.params
    const campId = await Campground.findById(id).populate({path:'reviews',populate: {path: 'author'}})
    .populate('author')
    if(!campId){
        req.flash('error', 'Cannot find campground!')
        res.redirect(`/campgrounds`)
    } else {
    res.render('campground/show', {campId})
    }
}

module.exports.editCamp = async (req,res)=>{
    const {id}=req.params
    const campE = await Campground.findById(id)
    if(!campE){
        req.flash('error', 'Cannot find campground!');
        res.redirect(`/campgrounds`)
    } else {
        res.render('campground/edit', {campE})
    }
}

module.exports.putCamp = async (req,res)=>{
    const {id} = req.params
    const {campground,deleteImages} = req.body
    const campE = await Campground.findByIdAndUpdate(id,campground)
    const images = req.files.map(f =>({path:f.path,filename:f.filename}))
    campE.images.push(...images)
    await campE.save()
    if(deleteImages) {
        for (let filename of deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await campE.updateOne({$pull:{images:{filename:{$in:deleteImages}}}});
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campE._id}`)
}

module.exports.destroyCamp = async (req,res)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!');
    res.redirect(`/campgrounds`)
}