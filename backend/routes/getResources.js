const express = require('express');
const Resource = require('../models/resources');
const {authenticate} = require('./auth')
const router = express.Router();

router.post('/resources', authenticate, async(req, res) => {
    try {
        const {id, name, description, eco_friendly, category, address, website, hours_of_operation, image_url} = req.body;
        if (!id || !name || !description || !category || !eco_friendly || !address){
            return res.status(400).json({error: 'Missing required fields.'});
        }
        const resource = new Resource({
            id,
            name,
            description,
            eco_friendly,
            category,
            address,
            website,
            hours_of_operation,
            image_url,
        });

        await resource.save();
        res.status(201).json({message: 'resource added successfully!!', resource});
    }
    catch (err) {
        console.error('error adding resource: ', err.message);
        res.status(500).json({error: 'failed to add resource'})
    }
});

router.get('/resources', async (req, res) => {
    try{
        const resources = await Resource.find();
        res.status(200).json(resources);
    } catch(err) {
        console.error('err fetching resources:', err.message);
        res.status(500),json({error: 'failed to fetch resources'});
    }
});

module.exports = router;

// app.get('/getResources', async (req, res) => {
//     try {
//         await client.connect();
//         const database = client.db('carbonwise');
//         const collection = database.collection('resources');
//         const resources = await collection.find({}).toArray();
//         res.status(200).json(resources);
//     } catch (error) {
//         res.status(500).send("Error fetching resources:", error);
//     } finally {
//         await client.close();
//     }
// });