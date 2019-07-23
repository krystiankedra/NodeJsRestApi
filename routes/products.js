const router = require('express').Router();
const verify = require('./verifyToken')

router.get('/', verify ,async (req, res) => {
    try {
        res.send('Products')
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;