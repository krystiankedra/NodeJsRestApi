const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../models/User');

router.get('/', verify, async (_, res) => {
    try {
        const users = await User.find();
        const mappedUsersStructure = users.map((user) => {
            const { _id, name, email, date } = user
            return { _id, name, email, date }
        });
        res.status(200).send(mappedUsersStructure);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:id', verify, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send(`User doesn't exist`);

        const { _id, name, email, date } = user;
        res.status(200).send({ _id, name, email, date });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;