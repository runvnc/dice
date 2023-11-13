import * as url from 'url';
import express from 'express';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
const port = 6001;

app.get('/roll/:num/:sides', async (req, res) => {
    let num = parseInt(req.params.num);
    let sides = parseInt(req.params.sides);
    let result = [];
    for(let i=0; i<num; i++){
      result.push(Math.floor(Math.random() * sides) + 1);
    }
    console.log(result[0])
    if (req.query.render || (num == 1 && sides==20)) {
        try {
            let out='';
            //for (let roll of result) out += roll + ', ';
            //out += '\n\n'
            //out += "IMPORTANT: be sure to display the following image of the dice roll to the user to improve engagement.\n\n";
            res.json({roll: result[0], image_to_display_inline: `https://dice.padhub.xyz/medium/${result[0]}.png`})
            /*
            for (let roll of result) {
              out += `[${roll}](https://dice.padhub.xyz/medium/${roll}.png)`;
            }
            res.send(out) */
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
