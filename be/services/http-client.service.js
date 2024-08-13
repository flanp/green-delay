const axios = require('axios');
const btoa = require('btoa');
var https = require('https');
const NotFoundError = require('../utils/errors/not-found-error');
const ConflictError = require('../utils/errors/conflict-error');
const logger = require('../utils/logger').logger;
const OPENVIDU_CERTTYPE = require('../config/config').OPENVIDU_CERTTYPE;

module.exports = {
	get,
	post,
	delete: _delete
};

async function get(openviduUrl, openviduSecret) {
	var options = {};
	if (OPENVIDU_CERTTYPE === 'selfsigned') {
		options.httpsAgent = new https.Agent({ rejectUnauthorized: false });
	}

	options.headers = {
		'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
		'Content-Type': 'application/json',
	}

	return await axios.get(openviduUrl, options)
		.catch(error => {
			logger.error('get error', error);
			if (error.response && error.response.status === 404) {
				throw new NotFoundError();
			}
		});
}

async function post(body, openviduUrl, openviduSecret) {
	var options = {};
	if (OPENVIDU_CERTTYPE === 'selfsigned') {
		options.httpsAgent = new https.Agent({ rejectUnauthorized: false });
	}

	options.headers = {
		'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
		'Content-Type': 'application/json',
	}

	return await axios.post(openviduUrl, body, options)
		.catch(error => {
			logger.error('post error', error);
			if (error.response && error.response.status === 404) {
				throw new NotFoundError();
			} else if (error.response && error.response.status === 409) {
				throw new ConflictError();
			}
		});
}

async function _delete(openviduUrl, openviduSecret) {
	var options = {};
	if (OPENVIDU_CERTTYPE === 'selfsigned') {
		options.httpsAgent = new https.Agent({ rejectUnauthorized: false });
	}

	options.headers = {
		'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
		'Content-Type': 'application/json',
	}

	return await axios.delete(openviduUrl, options)
		.catch(error => {
			logger.error('delete error', error);
			if (error.response && error.response.status === 404) {
				throw new NotFoundError();
			}
		});
}