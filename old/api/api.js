const express = require('express');

const api = express()

api.get('/get/data/:name', (req, res)=>{
    const name = req.params.name;
    res.json(liveData[name]);
});

api.get('/get/datasets', (req, res)=>{
    res.json(Object.keys(liveData));
})

api.post('/post/append/:dataset', (req, res)=>{
    const dataset = req.params.dataset;
    const data = req.body;

    //Ajout des données coté serveur
    data.forEach(element => {
        liveData[dataset].push(element)
    });

    //Informe les client du changement
    wsList.forEach(ws=>ws.send(JSON.stringify({type:'Update', data:dataset, updateData:data})));

    //Retour
    res.sendStatus(201);
    return;
});


api.post('/post/create/:dataset', (req, res)=>{
    const dataset = req.params.dataset;
    const data = req.body;

    //Ajout des données coté serveur
    liveData[dataset] = data?data:[];

    //Informe les client du changement
    wsList.forEach(ws=>ws.send(JSON.stringify({type:'New dataset', data:dataset})));

    //Retour
    res.sendStatus(201);
    return;
});


api.delete('/delete/:dataset', (req, res)=>{
    const dataset = req.params.dataset;
    delete liveData[dataset]

    //Informe les client du changement
    wsList.forEach(ws=>ws.send(JSON.stringify({type:'Delete dataset', data:dataset})));

    res.json(201);
    return;
});

//Stocke toutes les données
const liveData = {};


const wsList = [];
// import du module nodejs "ws"
const WebSocketServer = require('ws').Server
// ouverture de la connexion (ici sur le port 6251)
const wss = new WebSocketServer({port: 6251});
// callback appelé à l'ouverture de la connexion
wss.on('connection', function(ws) {
    wsList.push(ws);

    /*
    // un fois la connexion ouverte, on déclare un  "callback" qui sera appelé à la réception d'un message
    ws.on('message', function(message) {
        console.log('Message reçu (serveur): %s', message);
    });
    // on envoie ensuite un message au navigateur qui vient de se connecter
    ws.send('Moi, je suis un serveur...');
    */
});


module.exports = api