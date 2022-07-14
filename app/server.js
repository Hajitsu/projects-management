const path = require('path');

module.exports = class Application {
	#express = require('express')();
	#app = this.#express();
	constructor(PORT, DB_URL) {
		this.configDatabase(DB_URL);
		this.configureApplication();
		this.createServer(PORT);
		this.createRoutes();
		this.errorHandler();
	}

	configureApplication() {
		this.#app.use(this.#express.json());
		this.#app.use(this.#express.urlencoded({ extended: true }));
		this.#app.use(this.#express.static(path.join(__dirname, '..', 'public')));
	}

	createServer(PORT) {
		const http = require('http');
		const server = http.createServer(this.#app);
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
		this.#app.use((req, res, next) => {
			return res.status(404).json({
				status: 404,
				success: false,
				message: 'path not found.',
			});
		});
		this.#app.use((error, req, res, next) => {
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
		this.#app.get('/', (req, res, next) => {
			return res.status(200).json({
				message: '.: welcome to hajitsu land :.',
			});
		});
	}
};
