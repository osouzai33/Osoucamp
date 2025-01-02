mapboxgl.accessToken =
    "pk.eyJ1Ijoib3NvdXphaSIsImEiOiJjbTVkdzQxcHcwbG85MmtxeTN2ODYwbjVtIn0.P5y6Z9RDE0gLrf90Wuf0lA";
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/light-v11", // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h6>${campground.title}</h6><p>${campground.location}</p>`
        )
    )
    .addTo(map);
