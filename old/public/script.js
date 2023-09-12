const charts = {};



//Websocket : Update interactif

// ouverture de la connexion
const ws = new WebSocket("ws://localhost:6251");


// on déclare un "callback" qui sera appelé à l'ouverture de la connexion
ws.onopen = async function() {
    //Creation des graphiques
    const datasets = await fetch('./api/get/datasets').then(res=>res.json());

    datasets.forEach(appendDataset);
};


// autre "callback" appelé à la réception d'un message
ws.onmessage = async function(message) {
    const jsonMessage = JSON.parse(message.data)
    const type = jsonMessage.type;
    const data = jsonMessage.data;

    switch(type){
        case 'Update':
            return updateDataset(data, jsonMessage.updateData);
        case 'New dataset':
            return appendDataset(data);
        case 'Delete dataset':
            return deleteDataset(data);
        default:
            console.log('Unknow type : '+type);
    }
};

async function appendDataset(dataset){
    const placeholder = document.querySelector('#graphHolder');

    if(charts[dataset] !== undefined){
        //Reset du graph
        deleteDataset(dataset);
    }

    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', dataset);

    const chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: dataset,
                data: [],
                borderWidth: 1
            }]
        },
        options: {
            tooltips: {enabled: false},
            hover: {mode: null},
            elements: {
                point:{
                    radius: 0
                }
            },
            normalized: true,
            animation: false,
            plugins: {
                decimation: {
                    enabled: false,
                    algorithm: 'min-max',
                },
            },
        }
    });
    
    //Repertorie le nouveau graph dans la liste de graphs
    charts[dataset] = chart;

    await updateDataset(dataset);

    //Place le graph
    placeholder.appendChild(canvas);
}

function deleteDataset(dataset){
    const canvas = document.querySelector('#'+dataset);
    delete charts[dataset];
    canvas.remove();

}

async function updateDataset(dataset, newData){
    
    const chart = charts[dataset];

    if(!newData){
        //Recupere toutes les données sur le serveur
        const data = await fetch('./api/get/data/'+dataset).then(res=>res.json());

        const x = data.map((d, i)=>i)
        chart.data.labels = x;
        chart.data.datasets[0].data = data;

        
    }
    else{
        //Ajoute les données au fur et a mesure

        //Update label
        const label = chart.data.labels
        const nextLabel = label.length
        const newLabels = newData.map((e, i)=>nextLabel+i);
        newLabels.forEach(nl=>label.push(nl));

        //Update data
        newData.forEach(nd=>chart.data.datasets[0].data.push(nd));
    }
    
    return;
}


//Call function every 5 second
var intervalId = setInterval(updateCharts, 1000);
//clearInterval(intervalId);//Clear the loop

function updateCharts(){
    Object.entries(charts).forEach(entry=>{
        entry[1].update();//chart.update()
    })
}
