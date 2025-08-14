"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  address: string;
  className?: string;
}

// Fix for default markers in Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Set default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

export function LeafletMap({ latitude, longitude, address, className }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      // Initialize the map
      const map = L.map(mapRef.current).setView([latitude, longitude], 15);
      mapInstanceRef.current = map;

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add marker
      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup(`
        <div class="p-2">
          <strong>Car Location</strong><br/>
          ${address}<br/>
          <small>Lat: ${latitude}, Lng: ${longitude}</small>
        </div>
      `);
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
      }
    };
  }, [latitude, longitude, address]);

  // Update map view when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.setView([latitude, longitude], 15);
        
        // Clear existing markers and add new one
        mapInstanceRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            mapInstanceRef.current?.removeLayer(layer);
          }
        });
        
        const marker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
        marker.bindPopup(`
          <div class="p-2">
            <strong>Car Location</strong><br/>
            ${address}<br/>
            <small>Lat: ${latitude}, Lng: ${longitude}</small>
          </div>
        `);
      } catch (error) {
        console.error('Error updating map:', error);
      }
    }
  }, [latitude, longitude, address]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-64 rounded-lg border ${className || ''}`}
      style={{ minHeight: '256px' }}
    />
  );
}