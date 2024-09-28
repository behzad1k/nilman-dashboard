import nmp_mapboxgl from '@neshan-maps-platform/mapbox-gl';
import { MapComponent } from '@neshan-maps-platform/mapbox-gl-react';
import SDKMap from '@neshan-maps-platform/mapbox-gl/dist/src/core/Map';
import React, { useEffect, useState } from 'react';
import endpoints from '../config/endpoints';
import restApi from '../services/restApi';
import '@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css';
const Neshan = ({
                  position,
                  setPosition,
  height = 700
                }) => {
  const [map, setMap] = useState(null);
  const [mapMarker, setMapMarker] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  // const [query, setQuery] = useState('');

  const search = async (query) => {
    const res = await restApi(endpoints.address.search).get({
      term: query,
      lat: position.lat,
      lng: position.lng
    });
    if (res.code == 200) {
      setSearchResult(res.data);
    }
  };

  const centerTarget = () => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        if (permissionStatus.state === 'denied') {
          // alert('Please allow location access.');
          window.location.href = 'app-settings:location';
        } else {
          navigator.geolocation.getCurrentPosition((e) => {
            setPosition({
              lat: e.coords.latitude.toString(),
              lng: e.coords.longitude.toString()
            });
          }, (e) => console.log('errror', e), { timeout: 10000 });
        }
      });
    } else {
      // alert('Geolocation is not supported in your browser.');
    }
  };
  useEffect(() => {
    mapMarker?.setLngLat([position.lng, position.lat]);
    map?.flyTo({
      center: [position.lng, position.lat]
    });
    setSearchResult([]);
  }, [position]);

  return (
    <div className="largeMap">
      <div className="mapSearchInput">
        <div className="mapSearchInputBox">
          <input onChange={async (input) => {
            if (input.target.value.length > 3) {
              await search(input.target.value);
            } else {
              setSearchResult([]);
            }
          }}/>
          <i></i>
        </div>
        {searchResult?.length > 0 &&
            <ul>
              {searchResult.slice(0, 10).map(e => <li onClick={() => setPosition({
                lng: e.location.x,
                lat: e.location.y
              })}>{e.title?.substring(0, 30)}<small>({(e.neighbourhood || e.address)?.substring(0, 40)})</small></li>)}
            </ul>
        }
      </div>
      <MapComponent
        style={{
          height: height,
          minWidth: '100%'
        }}
        options={{
          mapKey: 'web.6809b3d028be4f27ace6326cd9eb0618',
          container: 'map',
          zoom: 15,
          pitch: 0,
          center: [position.lng, position.lat],
          minZoom: 2,
          maxZoom: 21,
          trackResize: false,
          poi: false,
          traffic: false,
          isTouchPlatform: true,
          mapTypeControllerOptions: {
            show: false,
            position: 'bottom-left'
          }
        }}
        mapSetter={(map: SDKMap) => {
          (map as any).on('load', function () {
            (map as any).resize();
          });

          (map as any).on('click', (e) => setPosition({
            lng: e.lngLat.lng.toString(),
            lat: e.lngLat.lat.toString()
          }))
          setMap(map);
          const marker = new nmp_mapboxgl.Marker({
            draggable: true,
            scale: 2,
            anchor: 'center',
            pitchAlignment: 'map'
          }).setLngLat([position.lng, position.lat]).addTo(map as any)
          .on('dragend', (e: any) => setPosition({
            lng: e.target._lngLat.lng.toString(),
            lat: e.target._lngLat.lat.toString()
          }));
          setMapMarker(marker);
        }}
      />
      <i className="mapTargetIcon" onClick={centerTarget}></i>
    </div>
  );
};

export default Neshan;
