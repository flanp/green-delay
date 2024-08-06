const express = require('express');
const router = express.Router();
const openviduService = require('../../services/openvidu.service');
const authorize = require('../../utils/authorize');
const validateErrors = require('../../utils/errors/validate-errors').validate;
const roles = require('../../utils/constants').roles;

router.get(
	'/',
	getAllSessions
);

router.post(
	'/create-session',
	authorize([roles.A, roles.W, roles.U]),
	validateErrors,
	createSession
);

router.post(
	'/generate-token',
	authorize([roles.A, roles.W, roles.U]),
	validateErrors,
	generateToken
);

router.delete(
	'/user',
	authorize([roles.A, roles.W]),
	validateErrors,
	deleteUser
);

module.exports = router;

async function getAllSessions(req, res, next) {
	openviduService
		.getAllSessions()
		.then(response => res.json(response))
		.catch(err => next(err));
}

async function createSession(req, res, next) {
	let sessionId = req.body.sessionId;
	console.log('Session id received: ', sessionId);

	try {
		const sessionResponse = await openviduService.createSession(sessionId);
		sessionId = sessionResponse.id;
	} catch (err) {
		// if we receive a conflict error, proceed with normal flow and keep sessionId received
		if (!err.name || err.name !== 'ConflictError') {
			return next(err);
		}
	}

	openviduService
		.createToken(sessionId, req.user.sub)
		.then(response => res.json(response.token))
		.catch(err => next(err));
}

async function generateToken(req, res, next) {
	let sessionId = req.body.sessionId;
	console.log('Session id received: ', sessionId);

	openviduService
		.createToken(sessionId, req.user.sub)
		.then(response => res.json(response.token))
		.catch(err => next(err));
}

async function deleteUser(req, res, next) {
	let sessionId = req.body.sessionId;
	console.log('Session id received: ', sessionId);

	openviduService
		.deleteUser(sessionId, req.body.username)
		.then(_ => res.json({}))
		.catch(err => next(err));
}