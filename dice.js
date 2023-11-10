const express = require('express');
const app = express();
const port = 6001;

app.get('/roll/:num/:sides', (req, res) => {
    let num = parseInt(req.params.num);
    let sides = parseInt(req.params.sides);
    let result = [];
    for(let i=0; i<num; i++){
        result.push(Math.floor(Math.random() * sides) + 1);
    }
    res.json(result);
});

app.use('/privacy', express.static('privacy-policy.txt'));

app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});
