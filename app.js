// serwer lokalny używany przez gulpa
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'src')));
app.use('*/img', express.static(path.join(__dirname, 'src/images')));
app.use('*/js', express.static(path.join(__dirname, 'src/scripts')));
app.use('*/css', express.static(path.join(__dirname, 'src/styles')));


app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
