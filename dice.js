import express from 'express';
import { renderGLBtoPNG } from './renderModel.js';

const app = express();
const port = 6001;

app.get('/roll/:num/:sides', async (req, res) => {
    let num = parseInt(req.params.num);
    let sides = parseInt(req.params.sides);
    let result = [];
    for(let i=0; i<num; i++){
        result.push(Math.floor(Math.random() * sides) + 1);
    }
    if (req.query.render) {
        try {
            await renderGLBtoPNG('d20.glb', 'output.png');
            res.sendFile('output.png', { root: __dirname });
        } catch (error) {
            console.error('Error rendering GLB to PNG:', error);
            res.status(500).send('Error rendering image');
        }
    } else {
        console.log({num, sides, result});
        res.json(result);
    }
});

app.use(express.static('static'));
app.use('/privacy', express.static('privacy-policy.txt'));

app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});
