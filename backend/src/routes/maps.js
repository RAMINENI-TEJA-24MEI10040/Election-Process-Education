"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapsRouter = void 0;
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
exports.mapsRouter = (0, express_1.Router)();
// Mock polling stations endpoint for demo purposes
// In a real app, this would query a database of official polling booths near the given lat/lng
exports.mapsRouter.get('/polling-stations', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            res.status(400).json({ error: 'Latitude and longitude are required' });
            return;
        }
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        // Generate mock polling stations near the user
        const mockStations = [
            {
                id: '1',
                name: 'Govt. Primary School (Polling Booth #12A)',
                lat: userLat + 0.005,
                lng: userLng + 0.002,
                address: 'Main Road, Block A',
                type: 'General',
            },
            {
                id: '2',
                name: 'Community Center (Polling Booth #14B)',
                lat: userLat - 0.003,
                lng: userLng - 0.004,
                address: 'Park Avenue, Block C',
                type: 'Accessible',
            },
            {
                id: '3',
                name: 'Municipal Hall (Polling Booth #09C)',
                lat: userLat + 0.008,
                lng: userLng - 0.001,
                address: 'Market Street',
                type: 'General',
            }
        ];
        res.json({ stations: mockStations });
    }
    catch (error) {
        console.error('Error fetching polling stations:', error);
        res.status(500).json({ error: 'Failed to fetch polling stations' });
    }
});
//# sourceMappingURL=maps.js.map