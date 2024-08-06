const httpClientService = require('./http-client.service');
const NotFoundError = require("../utils/errors/not-found-error.js");
const { connection } = require('mongoose');
const { User } = require('../utils/db-helper');
const openviduUrl = require('../config/config').OPENVIDU_URL;
const openviduSecret = require('../config/config').OPENVIDU_SECRET;

module.exports = {
	createSession,
	createToken,
	deleteUser,
	getSessionInfo,
	getAllSessions
};

async function createSession(sessionId) {
	const url = `${openviduUrl}/api/sessions`;
	console.log("Requesting session to ", url);
	console.log("Openvidu url ", openviduUrl);
	console.log("Openvidu secret ", openviduSecret);
	const body = JSON.stringify({ customSessionId: sessionId });

	return new Promise((res, rej) => {
		httpClientService.post(body, url, openviduSecret)
			.then(response => {
				console.log('response', response.data);
				return res(response.data);
			})
			.catch(error => {
				console.log(`error create session ${sessionId}`, error);
				return rej(error);
			});
	});
}

async function createToken(sessionId, sub) {
	const url = `${openviduUrl}/api/tokens`;
	console.log("Requesting token to ", url);
	const body = { 
		session: sessionId, 
		kurentoOptions: {
			allowedFilters: ['GStreamerFilter']
		} 
	};
	
	const user = await User.findById(sub);
	if (user && user.role !== 'U') {
		body.role = 'MODERATOR';
	} else {
		body.role = 'SUBSCRIBER';
	}

	return new Promise((res, rej) => {
		httpClientService.post(JSON.stringify(body), url, openviduSecret)
			.then(response => {
				console.log(response.data);
				return res(response.data);
			})
			.catch(error => {
				console.log(`error create token ${sessionId}`, error);
				return rej(error);
			});
	});
}

async function deleteUser(sessionId, username) {
	let url = `${openviduUrl}/api/sessions/${sessionId}`;
	console.log("Requesting session information to ", url);

	const sessionInfo = await httpClientService.get(url, openviduSecret);

	var connections = sessionInfo.data.connections.content.filter(conn => conn.clientData === `CLIENT:${username}`);
	if (!connections || connections.length === 0) {
		throw new NotFoundError('O utilizador não foi encontrado');
	}

	return Promise.all(
		connections.map(connection => {
			url = `${openviduUrl}/api/sessions/${sessionId}/connection/${connection.connectionId}`;

			return new Promise((res, rej) => {
				httpClientService.delete(url, openviduSecret)
					.then(response => {
						console.log('response', response.status);
						return res();
					})
					.catch(error => {
						console.log(`error deleting user ${sessionId} ${username}`, error);
						return rej();
					});
			});
		})
	);
}

async function getSessionInfo(sessionId) {
	let url = `${openviduUrl}/api/sessions/${sessionId}`;
	console.log("Requesting session information to ", url);

	return new Promise((res, rej) => {
		httpClientService.get(url, openviduSecret)
			.then(response => {
				console.log('response', response.data);
				if (response.data.connections.numberOfElements === 0) {
					return res(0);
				} else {
					var hasPublisher = false;
					for (var i = 0; i < response.data.connections.numberOfElements; i++) {
						var conn = response.data.connections.content[i];
						if (conn.publishers && conn.publishers.length > 0) {
							hasPublisher = true;
							break;
						}
					}

					return res(hasPublisher ? 1 : 0);
				}
			})
			.catch(error => {
				console.log(`error getting session info ${sessionId}`, error);
				if (error.name === 'NotFoundError') {
					return res(0);
				}
				return rej(error);
			});
	});
}

async function getAllSessions() {
	let url = `${openviduUrl}/api/sessions`;
	console.log("Requesting all sessions information to ", url);

	return new Promise((res, rej) => {
		httpClientService.get(url, openviduSecret)
			.then(response => {
				console.log(response.data);
				return res(response.data);
			})
			.catch(error => {
				console.log(`error getting all sessions`, error);
				return rej(error);
			});
	});
}