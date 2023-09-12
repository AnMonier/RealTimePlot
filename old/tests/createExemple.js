'use-strict';
const fetch = require('node-fetch');


fetch('http://localhost:6250/api/post/create/exemple',{
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify([1,2,4]),
    });