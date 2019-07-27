const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User')
const verify = require('./verifyToken');

router.post('/buy/:userId/:productId', verify, async (req, res) => {
    try {
        const product = await Product.findById({ _id: req.params.productId });
        if (!product) return res.status(400).send(`Product doesn't exist`);

        const user = await User.findById({ _id: req.params.userId });
        const isUserOwnerProduct = user.products.find(product => product._id === req.params.productId);
        if (isUserOwnerProduct) return res.status(400).send(`You can't buy self product`);

        await User.updateOne({ products: [...user.products, product] });
        await Product.deleteOne({ _id: req.params.productId });

        res.status(200).send('Transaction was successful');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;