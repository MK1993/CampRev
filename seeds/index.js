const Campground = require('../models/campground')
const cities = require('./cities')
const seedHelpers = require('./seedHelpers')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/camp_rev', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const sample = array=> array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    for (let i=0;i<50;i++){
        const rand1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: "60ba97bb2315852f24ad8535",
            location : `${cities[rand1000].city},${cities[rand1000].state}`, 
            title: `${sample(seedHelpers.descriptors)} ${sample(seedHelpers.places)}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[rand1000].longitude,cities[rand1000].latitude]
            },
            images: [ 
                { path : "https://res.cloudinary.com/dopvsufeh/image/upload/v1622948528/CampRev/hxe3kr0fdifvoc4cqprj.jpg", filename : "CampRev/hxe3kr0fdifvoc4cqprj" }, 
                { path : "https://res.cloudinary.com/dopvsufeh/image/upload/v1622948528/CampRev/fdafwk21ze9nlia4ndv9.jpg", filename : "CampRev/fdafwk21ze9nlia4ndv9" }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed bibendum consectetur mollis. Aliquam eu feugiat tellus. Cras fermentum sit amet eros eget finibus.',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})