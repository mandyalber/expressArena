const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello Express!');
});
app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
      Base URL: ${req.baseUrl}
      Host: ${req.hostname}
      Path: ${req.path}
    `;
    res.send(responseText);
});
/*drill 1*/
app.get('/sum', (req, res) => {
    const a = req.query.a
    const b = req.query.b

    if (!a) {
        return res.status(400).send('Please provide a number a')
    }
    const numA = parseInt(a, 10);
    if (Number.isNaN(numA)) {
        return res
            .status(400)
            .send('a must be a number');
    }
    if (!b) {
        return res.status(400).send('Please provide a number b')
    }
    const numB = parseInt(b, 10);
    if (Number.isNaN(numB)) {
        return res
            .status(400)
            .send('b must be a number');
    }

    const sum = numA + numB
    res.status(200).send(`The sum of ${a} and ${b} is ${sum}`)
})
/*drill 2*/
app.get('/cipher', (req, res) => {
    const text = req.query.text;
    const shift = req.query.shift;

    if (!text) {
        return res.status(400).send('Please provide some text')
    }

    if (!shift) {
        return res.status(400).send('Please provide a number to shift')
    }
    const numShift = parseInt(shift, 10);
    if (Number.isNaN(numShift)) {
        return res.status(400).send('Shift must be a number')
    }

    const base = 'A'.charCodeAt(0)
    const cipher = text.toUpperCase().split('').map(char => {
        const code = char.charCodeAt(0)
        if (code < base || code > (base + 26)) {
            return char
        }
        let diff = code - base
        diff = diff + numShift
        diff = diff % 26

        const shiftedChar = String.fromCharCode(base + diff)
        return shiftedChar
    }).join('')


    res.status(200).send(cipher)
})

/*drill 3*/
app.get('/lotto', (req, res) => {
    const numArray = req.query.numArray    
    
    console.log(numArray)
    //validation
    if (!numArray) {
        return res.status(400).send('an array of numbers is required')
    }

    if (!Array.isArray(numArray)) {
        return res.status(400).send('the numbers must be an array.')
    }
    const numbers = numArray
        .map(num => parseInt(num, 10))
        .filter(num => !Number.isNaN(num) && (num >= 1 && num <= 20))
    if (numbers.length != 6) {
        return res.status(400).send('the numbers array must have 6 numbers between 1 and 20.')
    }
    //randomly generated numbers array
    const stockNumArray = Array(20).fill(1).map((_, i) => i + 1);
    const lottoNumArray = [];
    for (let i = 0; i < 6; i++) {
        const randNum = Math.floor(Math.random() * stockNumArray.length)
        lottoNumArray.push(stockNumArray[randNum])
        stockNumArray.splice(randNum, 1)
    }
    //check for matches
    let unMatched = lottoNumArray.filter(num => numbers.includes(num))

    let responseText = ''

    switch (unMatched.length) {
        case 0:
            responseText = 'Wow! Unbelievable! You could have won the mega millions!'
            break
        case 1:
            responseText = 'Congratulations! You win $100!'
            break
        case 2:
            responseText = 'Congratulations, you win a free ticket'
            break
        default:
        responseText = 'Sorry, you lose'
    }

    res.status(200).send(responseText)

})

/*To send an array of values to the server via a query string simply repeat the key with different values. For instance, the query string ?arr=1&arr=2&arr=3 results in the query object { arr: [ '1', '2', '3' ] }.

Create a new endpoint /lotto that accepts an array of 6 distinct numbers between 1 and 20 named numbers.

The function then randomly generates 6 numbers between 1 and 20. Compare the numbers sent in the query with the randomly generated numbers to determine how many match.

If fewer than 4 numbers match respond with the string "Sorry, you lose".
If 4 numbers match respond with the string "Congratulations, you win a free ticket",
if 5 numbers match respond with "Congratulations! You win $100!".
If all 6 numbers match respond with "Wow! Unbelievable! You could have won the mega millions!".*/