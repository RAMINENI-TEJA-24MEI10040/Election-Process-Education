import request from 'supertest';
import express from 'express';
import { chatRouter } from '../src/routes/chat';
import { mapsRouter } from '../src/routes/maps';

const app = express();
app.use(express.json());
app.use('/api/chat', chatRouter);
app.use('/api/maps', mapsRouter);

describe('Backend API Tests', () => {
  describe('POST /api/chat', () => {
    it('should return 400 if message is missing', async () => {
      const res = await request(app).post('/api/chat').send({ persona: 'student' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Message is required');
    });

    // We can't easily mock the google SDK directly in this simple setup without jest mocks
    // but this ensures the route exists and validates inputs.
  });

  describe('GET /api/maps/polling-stations', () => {
    it('should return 400 if lat/lng are missing', async () => {
      const res = await request(app).get('/api/maps/polling-stations');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Latitude and longitude are required');
    });

    it('should return mock polling stations with valid lat/lng', async () => {
      const res = await request(app).get('/api/maps/polling-stations?lat=28.6139&lng=77.2090');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('stations');
      expect(res.body.stations).toBeInstanceOf(Array);
      expect(res.body.stations.length).toBeGreaterThan(0);
      expect(res.body.stations[0]).toHaveProperty('name');
      expect(res.body.stations[0]).toHaveProperty('lat');
      expect(res.body.stations[0]).toHaveProperty('lng');
    });
  });
});
