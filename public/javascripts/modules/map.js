import axios from 'axios';
import { $ } from './bling';

const mapOptions ={
  center: {
    lat: 43.2,
    lng: -79.8
  },
  zoom: 12
};

function loadPlaces(map, lat=43.2, lng=-79.8) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
    .then(res => {
      const places = res.data;
      if(!places.length) {
        alert('No places found');
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      const infoWindow = new google.maps.InfoWindow();

      // Create Markers
      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates;
        const position = { lat: placeLat, lng: placeLng };
        const marker = new google.maps.Marker({ map, position });

        bounds.extend(position);
        marker.place = place;
        return marker;
      });

      // Show place details when marker is clicked
      markers.forEach(marker => marker.addListener('click', function() {
        const html = `
<div class="popup">
  <a href="/store/${this.place.slug}">
    <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}">
    <p>${this.place.name} - ${this.place.location.address}</p>
  </a>
</div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      }));

      // Fit map zoom to bounds
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);

    });
}

function makeMap(mapDiv) {
  if(!mapDiv) return;

  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);

  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
  });
}

export default makeMap;
