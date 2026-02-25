const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
    console.info(`Server berjalan di port ${config.port}`);
});
