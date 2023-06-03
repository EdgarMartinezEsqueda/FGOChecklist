
import servants from "../lib/servants.json" assert {type: 'json'};
// Total current FGO servants
const totalServants = {
    '★5' : 143,  
    '★4' : 154,   
    '★3' : 48,    
    '★2' : 15,   
    '★1' : 12,    
    '★0' : 1,
    'All' : 373   
};
// Total own FGO servants
let nServants = {
    '★5' : 0,  
    '★4' : 0,   
    '★3' : 0,    
    '★2' : 0,   
    '★1' : 0,    
    '★0' : 0   
}, totalOwnServants = 0;

// Load servants data and display them
(() => {
    servants.forEach( rarity=> {
        let newDiv = document.createElement("div");
        let data =
        `<div class="cntTablaServant" id="Tabla_${rarity.list_id}">
            <table class="table table-striped table-bordered tablaRarezas" rarity="Tabla_${rarity.list_id}">
                <thead id="${rarity.list_id}">
                    <th>
                        ${rarity.list_name}
                    </th>
                    <button type="button" class="btn btn-outline-dark guardar material-symbols-outlined" title="Descargar sección"> 
                        <span class="material-symbols-outlined">
                            download
                        </span> 
                    </button>
                </thead>
                <tbody>
                    <tr class="cntServants">`;
        rarity.list.forEach(servant => {
            data +=
                `<td>
                    <div class="cntIconServant" rarity="${rarity.list_name}" title="${servant.name}" >
                        <img src="${servant.imgpath}" alt="${servant.name}" loading="lazy"
                            class="servantIcon disabled">
                        <img class="tipo_${servant.stype}" >
                    </div>
                </td>`;
        });
        data +=
                    `</tr>
                </tbody>
            </table>
        </div>`;
        newDiv.innerHTML = data;
        document.getElementById("cntAllServants").appendChild( newDiv );
    });
})();

// Add icons to some servants 
document.querySelectorAll('.tipo_2').forEach(servant => {
    servant.src = "./img/padlock.png";
}), document.querySelectorAll('.tipo_3').forEach(servant => {
    servant.src = "./img/estrella.png";
}), document.querySelectorAll('.tipo_4').forEach(servant => {
    servant.src = "./img/giftbox.png";
});

// Toggle 'disable' class on images... 𝐈𝐓 𝐃𝐎𝐄𝐒𝐍'𝐓 𝐖𝐎𝐑𝐊 𝐖𝐈𝐓𝐇 𝐀𝐑𝐑𝐎𝐖 𝐅𝐔𝐍𝐂𝐓𝐈𝐎𝐍𝐒
$('.cntIconServant').mousedown(function(event) {
    // Disable context menu only on images
    $(this).bind("contextmenu", function() {
        return false;
    });
    // get NPs from that servant/image
    let veces = parseInt( $(this).attr('data-NP') ) || 0;
    // Know what button was clicked
    switch (event.which) {
        case 1: // Left click
            $(this).children(":first").removeClass('disabled');
            $(this).addClass('active'); 
            if (veces === 0){
                nServants[$(this).attr('rarity')] ++;
                totalOwnServants ++;
            }
            if(veces < 5) $(this).attr('data-NP', veces += 1);
            break;
        case 3: // Right click
            if(veces === 1){
                nServants[$(this).attr('rarity')] --;
                totalOwnServants --;
            }
            if(veces > 1) $(this).attr('data-NP', veces -= 1);
            else{
                $(this).children(":first").addClass('disabled');
                $(this).removeClass('active');
                $(this).attr('data-NP', '');
            }
            break;
    }
    updateFields(); // Update info table
});

// Update first table
let updateFields = () => {
    // SSR -> Super Super Rare
    $('#nSSR').text(nServants['★5'] + "/" + totalServants['★5']);
    $('#nSSRP').text((nServants['★5'] / totalServants['★5'] * 100).toFixed(2) + "%");
    // SR   -> Super Rare
    $('#nSR').text(nServants['★4'] + "/" + totalServants['★4']);
    $('#nSRP').text((nServants['★4'] / totalServants['★4'] * 100).toFixed(2) + "%");
    // R -> Rare
    $('#nR').text(nServants['★3'] + "/" + totalServants['★3']);
    $('#nRP').text((nServants['★3'] / totalServants['★3'] * 100).toFixed(2) + "%");
    // UC -> Uncommon
    $('#nUC').text(nServants['★2'] + "/" + totalServants['★2']);
    $('#nUCP').text((nServants['★2'] / totalServants['★2'] * 100).toFixed(2) + "%");
    // C  -> Common
    $('#nC').text(nServants['★1'] + "/" + totalServants['★1']);
    $('#nCP').text((nServants['★1'] / totalServants['★1'] * 100).toFixed(2) + "%");
    // N -> Angra
    $('#nN').text(nServants['★0'] + "/" + totalServants['★0']);
    $('#nNP').text((nServants['★0'] / totalServants['★0'] * 100).toFixed(2) + "%");

    // Total
    $('#totalServants').text(totalOwnServants + "/" + totalServants['All']);
    $('#totalServantsP').text((totalOwnServants / totalServants['All'] * 100).toFixed(2) + "%");
}

// Take screenshot of the table
$('.guardar').on('click', function() {
    html2canvas( document.querySelector(`[rarity*="${$(this).closest('div').attr('id')}"]`), {useCORS: true} ).then( (canvas)  => {
        saveAs(canvas.toDataURL('image/png'), $(this).closest('div').attr('id') + '.png');
    });
});

// Take screenshot of all tables
$('#guardarTodo').on('click', function() {
    html2canvas( document.querySelector(`#cntAllServants`), {useCORS: true} ).then( (canvas)  => {
        saveAs(canvas.toDataURL('image/png'), 'AllInfo.png');
    });
});
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
