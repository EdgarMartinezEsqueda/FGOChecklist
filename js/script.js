let servantsData = [];

// Total current FGO servants
const totalServants = {
    '5' : 0,  
    '4' : 0,   
    '3' : 0,    
    '2' : 0,   
    '1' : 0,    
    '0' : 0,
    'All' : 0   
};
// Total own FGO servants
let nServants = {
    '5' : 0,  
    '4' : 0,   
    '3' : 0,    
    '2' : 0,   
    '1' : 0,    
    '0' : 0   
}, totalOwnServants = 0;

// Take screenshot of all tables
function takeScreenshot() {
    html2canvas( document.querySelector(`#cntAllServants`), {useCORS: true} )
    .then( (canvas)  => {
        saveAs(canvas.toDataURL('image/png'), 'AllInfo.png');
    });
}

// Download the image ↑
function saveAs(uri, filename) {
    let link = document.createElement('a');
    link.href = uri;
    link.download = filename;
    //Firefox requires the link to be in the body
    document.body.appendChild(link);
    //simulate click
    link.click();
    //remove the link when done
    document.body.removeChild(link);
}

const sortServants = (category) => {
    if (category === "id" )
        return {"ID" : servantsData.sort( (a,b) => a.game_id - b.game_id ) }
    return servantsData.reduce((result, item) => {
        const key = item[category] + "\u200B";
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
        return result;
        }, {});
};

// Update first table
const updateFields = () => {
    // SSR -> Super Super Rare
    document.getElementById("nSSR").innerText = nServants['5'] + "/" + totalServants['5'];
    document.getElementById("nSSRP").innerText = ( (nServants['5'] / totalServants['5'] * 100).toFixed(2) + "%");
    // R => Super Rare
    document.getElementById("nSR").innerText = nServants['4'] + "/" + totalServants['4'];
    document.getElementById("nSRP").innerText = ( (nServants['4'] / totalServants['4'] * 100).toFixed(2) + "%");
    // R -> Rare
    document.getElementById("nR").innerText = nServants['3'] + "/" + totalServants['3'];
    document.getElementById("nRP").innerText = ( (nServants['3'] / totalServants['3'] * 100).toFixed(2) + "%");
    // UC => Uncommon
    document.getElementById("nUC").innerText = nServants['2'] + "/" + totalServants['2'];
    document.getElementById("nUCP").innerText = ( (nServants['2'] / totalServants['2'] * 100).toFixed(2) + "%");
    // C => Common
    document.getElementById("nC").innerText = nServants['1'] + "/" + totalServants['1'];
    document.getElementById("nCP").innerText = ( (nServants['1'] / totalServants['1'] * 100).toFixed(2) + "%");
    // N => Angra
    document.getElementById("nN").innerText = nServants['0'] + "/" + totalServants['0'];
    document.getElementById("nNP").innerText = ( (nServants['0'] / totalServants['0'] * 100).toFixed(2) + "%");
    //Total
    document.getElementById("totalServants").innerText = totalOwnServants + "/" + totalServants['All'];
    document.getElementById("totalServantsP").innerText = ( (totalOwnServants / totalServants['All'] * 100).toFixed(2) + "%");
}

function saveOnBrowser(){
    localStorage.setItem("dataServants", JSON.stringify(servantsData));
}

function resetAll(){
    localStorage.clear();
    location.reload(true);
}