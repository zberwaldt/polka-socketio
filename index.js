const { PORT=3000, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const polka = require('polka');
const sirv = require('sirv');
const compression = require('compression');

const app = polka();

app.use(compression({ threshold: 0 }));
app.use(sirv('static', { dev }))

const { server } = app.listen(PORT, err => {
	if (err) throw err;
	console.log(`> Running on localhost:${PORT}`);
})

const io = require('socket.io')(server);

io.on('connection', socket => {
	socket.on('chat message', (msg) => {
		io.emit('chat message', msg);
	})

	socket.on('disconnect', _ => {
		console.log('user disconnect');
	})
})