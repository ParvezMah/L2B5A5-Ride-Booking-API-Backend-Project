"use strict";
// utils/haversine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.haversineDistance = void 0;
const haversineDistance = (lon1, lat1, lon2, lat2) => {
    const R = 6371000; // Earth radius in meters
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
};
exports.haversineDistance = haversineDistance;
