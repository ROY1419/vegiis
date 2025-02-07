"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface DeliveryLocation {
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export default function DeliveryTracking({ orderId }: { orderId: string }) {
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!orderId || !session) return;

    const fetchLocation = async () => {
      try {
        const response = await fetch(`/api/delivery/track?orderId=${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setDeliveryLocation(data);
        } else {
          console.error("Failed to fetch delivery location");
        }
      } catch (error) {
        console.error("Error fetching delivery location:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch location once
    fetchLocation();

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchLocation, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [orderId, session]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!deliveryLocation) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <p>No delivery location available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Track Your Delivery</h1>
      <div className="map-container" style={{ height: "500px", width: "100%" }}>
        {/* Embed a Map Component */}
        <iframe
          src={`https://www.google.com/maps?q=${deliveryLocation.latitude},${deliveryLocation.longitude}&z=15&output=embed`}
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen={false}
          aria-hidden="false"
          tabIndex={0}
        ></iframe>
      </div>
      <p className="text-base-content/70 mt-4">
        Last updated: {new Date(deliveryLocation.updatedAt).toLocaleTimeString()}
      </p>
    </div>
  );
}
