import { MapPinIcon } from "lucide-react";
import { iconsForLeafpad } from "../../assets/assets";
import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function LiveMap({ order, liveLocation }: { order: any, liveLocation: any }) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const truckMarkerRef = useRef<L.Marker | null>(null);
    const destMarkerRef = useRef<L.Marker | null>(null);

    // Custom delivery truck icon
    const truckIcon = new L.Icon({
        iconUrl: iconsForLeafpad.truck,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });

    // Destination pin icon
    const destinationIcon = new L.Icon({
        iconUrl: iconsForLeafpad.destination,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    // Determine target location data
    const hasLiveLoc = liveLocation && liveLocation.lat !== 0;
    const hasDestLoc = order.shippingAddress?.lat && order.shippingAddress?.lng;
    const shouldShowMap = order.status !== "Delivered" && order.status !== "Cancelled" && (hasLiveLoc || hasDestLoc);

    useEffect(() => {
        if (!shouldShowMap || !mapContainerRef.current) {
            // Clean up if map should hide
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            return;
        }

        // 1. Initialize map instance if it doesn't exist
        const centerLat = hasLiveLoc ? liveLocation.lat : order.shippingAddress.lat;
        const centerLng = hasLiveLoc ? liveLocation.lng : order.shippingAddress.lng;

        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapContainerRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView([centerLat, centerLng], 15);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapInstanceRef.current);
        }

        const map = mapInstanceRef.current;

        // 2. Manage Live Truck Marker
        if (hasLiveLoc) {
            if (!truckMarkerRef.current) {
                truckMarkerRef.current = L.marker([liveLocation.lat, liveLocation.lng], { icon: truckIcon })
                    .addTo(map)
                    .bindPopup("Delivery Partner");
            } else {
                truckMarkerRef.current.setLatLng([liveLocation.lat, liveLocation.lng]);
            }
            // Keep map view centered on moving truck
            map.setView([liveLocation.lat, liveLocation.lng], map.getZoom());
        } else if (truckMarkerRef.current) {
            truckMarkerRef.current.remove();
            truckMarkerRef.current = null;
        }

        // 3. Manage Destination Marker
        if (hasDestLoc) {
            if (!destMarkerRef.current) {
                destMarkerRef.current = L.marker([order.shippingAddress.lat, order.shippingAddress.lng], { icon: destinationIcon })
                    .addTo(map)
                    .bindPopup("Delivery Address");
            } else {
                destMarkerRef.current.setLatLng([order.shippingAddress.lat, order.shippingAddress.lng]);
            }
        } else if (destMarkerRef.current) {
            destMarkerRef.current.remove();
            destMarkerRef.current = null;
        }

    }, [liveLocation, order.shippingAddress, shouldShowMap]);

    // Final cleanup on unmount
    useEffect(() => {
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    if (order.status === "Delivered" || order.status === "Cancelled") {
        return null;
    }

    return (
        <div className="rounded-2xl overflow-hidden border border-app-border" style={{ height: 280 }}>
            {shouldShowMap ? (
                <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
            ) : (
                <div className="h-full bg-app-green/5 flex-center">
                    <div className="text-center">
                        <MapPinIcon className="size-8 text-app-green/40 mx-auto mb-2" />
                        <p className="text-sm text-app-green/50 font-medium">Waiting for delivery partner location...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
