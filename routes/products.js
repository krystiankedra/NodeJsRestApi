const router = require('express').Router();
const verify = require('./verifyToken');
const { productValidation } = require('../validation/validation');
const Product = require('../models/Product');

router.get('/', verify , async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:id', verify, async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) return res.status(400).send(`Product doesn't exist`);

        res.status(200).send(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/', verify, async (req, res) => {
    const { error } = productValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const product = new Product({
        userId: req.user._id,
        title: req.body.title,
        description: req.body.description
    });

    try {
        await product.save();
        res.status(200).send(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:id', verify, async (req, res) => {
    try {
        const product = await Product.findById({ _id: req.params.id });
        if (!product) return res.status(400).send(`Product doesn't exist`);

        const isUserOwnerProduct = product.userId === req.user._id;
        if (!isUserOwnerProduct) return res.status(400).send(`You can't delete someone's product`);

        await Product.deleteOne({ _id: req.params.id });
        res.status(200).send()
    } catch (err) {
        res.status(400).send(err);
    }
})
module.exports = router;