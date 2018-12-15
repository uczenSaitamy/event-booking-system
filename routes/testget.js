const express = require('express');

const router = new express.Router();

router.get('/test', (req, res) => {
    console.log('echo');
    res.status(200).json({
        message: "This is test get"
    });
});

module.exports = router;