const Application = require('./app/server');

const DB_URL = 'mongodb://localhost:27017/ProjectsManagement';
new Application(1414, DB_URL);
