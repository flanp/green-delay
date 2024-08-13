const express = require('express');
const router = express.Router();

router.get(
	'/status',
	async (req, res, next) => {
		res.json({status: 'All good mate :)'});
	}
);

module.exports = router;