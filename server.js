const express = require('express');
const fs = require('fs');
const createStoneObj = require('./stone');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.listen(process.env.PORT || 3000);

const updateObjProp = (obj, value, propPath) => {
    const [head, ...rest] = propPath
        .split('_')
        .map(p => p.replace(/-/g, ' ').trim())

    !rest.length
        ? obj[head] = value
        : updateObjProp(obj[head], value, rest.join('_'));
}

app.get('/get', async (req, res) => {
    res.json({...createStoneObj()});
});

app.post('/save', async (req, res) => {
    const base = require('./stone.json');
    updateObjProp(base, req.body.value, req.body.propPath);
    fs.writeFile('stone.json', JSON.stringify(base, null, 4), err => {
        if (err) throw err;
        console.log('JSON saved!');
    });
    res.json({...createStoneObj()});
});