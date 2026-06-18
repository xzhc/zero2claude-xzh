const express = require('express');
const app = express();
const port = 3001;
    
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/about', (req, res) => {
    res.send('This is a about page');
});

app.get('/api/time', (req, res) => {
    res.json({
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
    });
});

app.get('/api/greeting', (req, res) => {
    const name = req.query.name || 'World'
    res.json({greeting: 'Hello, ' + name + "!"})
})

app.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
})
    