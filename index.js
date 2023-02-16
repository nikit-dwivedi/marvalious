const http = require('http');
const app = require('./app');
require('dotenv').config()
// require('./src/api/v1/controllers/backup.controller')
process.env.TZ = 'Asia/Calcutta';
const port = process.env.PORT || 4006;
const IP = process.env.IP || '127.0.0.1';
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Fablo listening at http://${IP}:${port}`)
});

