# CampRev

CampRev is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account.

This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

## Live Demo

To see the app in action, go to https://camprev.herokuapp.com/

## Features

* Authentication:
  * User login with username and password

* Authorization:
  * User cannot manage posts or comments without being authenticated
  * User cannot edit or delete posts or comments created by other users

* Manage campground posts with basic functionalities:
  * Read, create, edit and delete posts and comments
  * Upload campground images

* Flash messages responding to users' interaction with the app

* Responsive web design

## Getting Started

> This app contains API secrets and passwords that have been hidden deliberately, so the app cannot be run with its features on your local machine. However, feel free to clone this repository if necessary.

Create an .env file and add values to the following variables:

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
MAPBOX_TOKEN=
DB_URL=
```

