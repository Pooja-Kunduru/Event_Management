// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/event_management', { // Use event_management database
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define the schema for location pricing
const locationPricingSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    decorationPrice: {
        type: Number,
        required: true,
    },
    cateringPrice: {
        type: Number,
        required: true,
    }
});

// Create a model from the schema (this will use the location_pricing collection)
const LocationPricing = mongoose.model('location_pricing', locationPricingSchema);

// Define the schema for events
const eventSchema = new mongoose.Schema({
    text: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    decoration: { type: Boolean, required: true },
    catering: { type: Boolean, required: true },
    completed: { type: Boolean, required: true },
    budget: { type: Number, required: true } // Added budget field
});

// Create a model for events
const Event = mongoose.model('event', eventSchema);

// API route to get all location pricing details
app.get('/api/location_pricing', async (req, res) => {
    try {
        const items = await LocationPricing.find(); // Fetch from location_pricing collection
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

// API route to add a new event
app.post('/api/events', async (req, res) => {
    const { text, date, time, location, decoration, catering } = req.body;
    
    try {
        // Find the location pricing
        const locationData = await LocationPricing.findOne({ location });
        if (!locationData) {
            return res.status(400).json({ error: 'Invalid location' });
        }
        
        // Calculate budget
        let budget = locationData.basePrice;
        if (decoration) budget += locationData.decorationPrice;
        if (catering) budget += locationData.cateringPrice;
        
        // Create new event
        const event = new Event({
            text,
            date,
            time,
            location,
            decoration,
            catering,
            completed: false,
            budget
        });
        
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// API route to get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find(); // Fetch from events collection
        res.json(events);
    } catch (err) {
        res.status(500).send(err);
    }
});

// API route to delete an event
app.delete('/api/events/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
