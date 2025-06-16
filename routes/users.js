const express = require('express')
const router = express.Router()
const userRepo = require('../repositories/users');
const authorization = require('../middlewares/authorize'); // ตัวเช็ค Token


router.route('/users')
    .get(authorization, async (req, res, next) => {
        try {
            const { filter, offset, limit } = req.query
            const results = await userRepo.find({ filter, offset, limit });
            res.status(200).json(results)
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    })

router.route('/user/:id')
    .put(authorization, async (req, res, next) => {
        try {
            const user_id = req.params.id
            const result = await userRepo.fineOne({ user_id });
            if (!result) return res.status(404).json({ message: 'User not found' });

            const { first_name, last_name } = req.body
            await userRepo.update({ first_name, last_name }, user_id);
            res.status(200).json({ message: 'User updated successfully' });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    })
    .get(authorization, async (req, res, next) => {
        try {
            const user_id = req.params.id
            const result = await userRepo.fineOne({ user_id });
            if (!result) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(result)
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    })
    .delete(authorization, async (req, res, next) => {
        try {
            const user_id = req.params.id
            const result = await userRepo.fineOne({ user_id });
            if (!result) return res.status(404).json({ message: 'User not found' });

            const resultDelete = await userRepo.softDelete(user_id);
            if (resultDelete > 0) return res.status(200).json({ message: 'User deleted successfully' });
            res.status(204).send();
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    })

router.route('/user/hardDelete/:id')
    .delete(authorization, async (req, res, next) => {
        try {
            const user_id = req.params.id
            const result = await userRepo.fineOne({ user_id });
            if (!result) return res.status(404).json({ message: 'User not found' });

            const resultDelete = await userRepo.hardDelete(user_id);
            if (resultDelete > 0) return res.status(200).json({ message: 'User hard deleted successfully' });
            res.status(204).send();
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    )




module.exports = router