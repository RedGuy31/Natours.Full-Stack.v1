mapboxgl.accessToken =
  "pk.eyJ1IjoiYnVybnljbyIsImEiOiJjbGVyOWhsM2gwY3RlM3Fwa2cxZzJ6M25qIn0._2GIwQZ8NALmKFhROpg5Kg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

const locations = JSON.parse(document.getElementById("map").dataset.locations);

if (locations) {
  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement("div");
    el.className = "marker";

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
} else {
  console.log(`...`);
}
