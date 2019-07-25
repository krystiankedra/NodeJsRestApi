const router = require('express').Router();
const verify = require('./verifyToken');
const { productValidation } = require('../validation/validation');
const Product = require('../models/Product');

router.get('/', verify , async (req, res) => {
    try {
        res.send('Products')
    } catch (err) {
        res.send(err);
    }
});

router.post('/', verify, async (req, res) => {
    const { error } = productValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const isCorrectUserId = req.user._id === req.body.userId
    if (!isCorrectUserId) return res.status(400).send('Invalid userId');

    const product = new Product({
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description
    })

    try {
        await product.save();
        res.status(200).send(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;