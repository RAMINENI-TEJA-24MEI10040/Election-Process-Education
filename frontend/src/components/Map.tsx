import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useEffect, useRef, useState } from 'react';

// Make sure to add this to your .env file
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface PollingStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  type: string;
}

const render = (status: Status): React.ReactElement => {
  if (status === Status.LOADING) return <div>Loading maps...</div>;
  if (status === Status.FAILURE) return <div>Error loading maps</div>;
  return <></>;
};

function MapContent({ center, zoom }: { center: google.maps.LatLngLiteral; zoom: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [stations, setStations] = useState<PollingStation[]>([]);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { center, zoom }));
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    // Fetch nearby polling stations (mocked backend call)
    const fetchStations = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/maps/polling-stations?lat=${center.lat}&lng=${center.lng}`);
        const data = await response.json();
        setStations(data.stations || []);
      } catch (error) {
        console.error("Failed to fetch stations", error);
      }
    };
    fetchStations();
  }, [center]);

  useEffect(() => {
    if (map && stations.length > 0) {
      stations.forEach((station) => {
        new window.google.maps.Marker({
          position: { lat: station.lat, lng: station.lng },
          map,
          title: station.name,
          label: '🗳️',
        });
      });
      
      // Add user marker
       new window.google.maps.Marker({
          position: center,
          map,
          title: "You are here",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 2,
          }
        });
    }
  }, [map, stations, center]);

  return <div ref={ref} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />;
}

export function Map() {
  // Default to New Delhi coordinates
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 28.6139, lng: 77.2090 });
  const zoom = 14;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("Geolocation blocked or failed. Using default.");
        }
      );
    }
  }, []);

  return (
    <div className="glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>📍 Nearest Polling Booths</h3>
      <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden' }}>
        {MAPS_API_KEY ? (
            <Wrapper apiKey={MAPS_API_KEY} render={render}>
              <MapContent center={center} zoom={zoom} />
            </Wrapper>
        ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--bg-card)', padding: '2rem', textAlign: 'center' }}>
                Google Maps API Key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file to view nearby polling stations.
            </div>
        )}
      </div>
    </div>
  );
}
