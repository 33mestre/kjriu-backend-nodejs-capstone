const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Search for items
router.get('/', async (req, res) => {
    try {
        // Task 1: Log the received search request with parameters
        logger.info('Received search request with parameters:', req.query);

        // Task 2: Connect to MongoDB using connectToDatabase function
        const db = await connectToDatabase();
        logger.info('Connected to database');

        // Task 3: Use the collection() method to retrieve the secondChanceItems collection
        const collection = db.collection('secondChanceItems');
        logger.info('Accessed collection secondChanceItems');

        // Task 4: Initialize the query object
        let query = {};

        // Task 5: Add filters to query if provided
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };  // case-insensitive search
            logger.info(`Adding name filter: ${req.query.name}`);
        }
        if (req.query.category) {
            query.category = req.query.category;
            logger.info(`Adding category filter: ${req.query.category}`);
        }
        if (req.query.condition) {
            query.condition = req.query.condition;
            logger.info(`Adding condition filter: ${req.query.condition}`);
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseFloat(req.query.age_years) };  // less than or equal to filter
            logger.info(`Adding age_years filter: ${req.query.age_years}`);
        }

        // Task 6: Log the constructed query
        logger.info('Executing query:', query);

        // Task 7: Fetch filtered items using the find(query) method
        const items = await collection.find(query).toArray();
        logger.info(`Found ${items.length} items matching the query`);

        // Task 8: Return the items as JSON
        res.json(items);
    } catch (error) {
        logger.error('Search Route Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
