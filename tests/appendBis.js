'use-strict';
const fetch = require('node-fetch');


fetch('http://localhost:6250/api/post/append/bis',{
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify([4]),
    });