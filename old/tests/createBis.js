'use-strict';
const fetch = require('node-fetch');


fetch('http://localhost:6250/api/post/create/bis',{
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify([]),
    });