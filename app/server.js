const path = require('path');
const { AllRoutes } = require('./routers/router');
module.exports = class Application {
	#_express = require('express');
	#_app = this.#_express();
	constructor(PORT, DB_URL) {
		this.configDatabase(DB_URL);
		this.configureApplication();
		this.createRoutes();
		this.createServer(PORT);
		this.errorHandler();
	}

	configureApplication() {
		this.#_app.use(this.#_express.json());
		this.#_app.use(this.#_express.urlencoded({ extended: true }));
		this.#_app.use(this.#_express.static(path.join(__dirname, '..', 'public')));
	}

	createServer(PORT) {
		const http = require('http');
		const server = http.createServer(this.#_app);
		server.listen(PORT, () => {
			console.log(`server started on ${PORT}`);
		});
	}

	configDatabase(DB_URL) {
		const mongoose = require('mongoose');
		mongoose.connect(DB_URL, (error) => {
			if (error) throw error;
			return console.log('conect to database is successfull.');
		});
	}

	errorHandler() {
		this.#_app.use((req, res, next) => {
			return res.status(404).json({
				status: 404,
				success: false,
				message: 'path not found.',
			});
		});
		this.#_app.use((error, req, res, next) => {
			const status = error?.status || 500;
			const message = error.message || 'Internal Server Error';
			return res.status(status).json({
				status: status,
				success: false,
				message: message,
			});
		});
	}

	createRoutes() {
		this.#_app.get('/', (req, res, next) => {
			return res.status(200).json({
				message: '.: welcome to hajitsu land :.',
			});
		});

		// this.#app.use('*',());
		// this.#app.use('*', (req, res, next) => {
		// 	try {
		this.#_app.use(AllRoutes);
		// 	} catch (err) {
		// 		next(err);
		// 	}
		// });
	}
};
