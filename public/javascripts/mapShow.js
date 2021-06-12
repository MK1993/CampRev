mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: campground.geometry.coordinates,
zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());

var marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setText(
            campground.location,
            campground.title
        )
    )
    .addTo(map)