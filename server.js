const express = require('express');
const fs = require('fs');
const createStoneObj = require('./stone');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.listen(process.env.PORT || 3000);

app.get('/get', async (req, res) => {
    res.json({...createStoneObj()});
});

app.post('/save', async (req, res) => {
    const base = require('./stone.json');
    for (key of req.body) {
        base[key] = req.body[key];
    }
    fs.writeFile('stone.json', JSON.stringify(base), err => {
        if (err) throw err;
        console.log('JSON saved!');
    });
    res.json({...createStoneObj()});
});