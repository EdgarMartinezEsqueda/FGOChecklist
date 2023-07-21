(() => {
    document.getElementById("sortedBy").onchange = function (evt) {
        createTable(evt.target.value);
    }
    const storedData = localStorage.getItem("dataServants");
    const storedVersion = localStorage.getItem("storedVersion");
    fetch("./lib/data.json")
        .then(response => response.json())
        .then(data => {
            if(!storedData){    //if it's the first time in the page
                console.log("Entro al IF");
                localStorage.setItem("storedVersion", JSON.stringify(data.version));
                localStorage.setItem("dataServants", JSON.stringify(data.data));
                servantsData = data.data;
            }
            else if(JSON.parse(storedVersion) !== data.version){  // if there's a new version of servants
                console.log("Entro al ELSE IF");
                const mergedData = mergeData( JSON.parse(storedData), data.data);
                localStorage.setItem("dataServants", JSON.stringify(mergedData));
                localStorage.setItem("storedVersion", JSON.stringify(data.version));
                servantsData = mergedData;
            }
            else{
                console.log("Entro al ELSE");
                servantsData = JSON.parse(storedData);
            }
            createTable("rarity");
            updateFields();
        })
        .catch(err => console.log(err));
})();

// Function to merge the new data with the existing data while avoiding duplicates
function mergeData(existingData, newData) {
    const mergedData = [...existingData];
    for (const newItem of newData) {
        const existingIndex = mergedData.findIndex(item => item.game_id === newItem.game_id);
        if (existingIndex !== -1) {
            const existingItem = mergedData[existingIndex];
            const isDifferent = Object.keys(newItem).some(key => existingItem[key] !== newItem[key]);
            if (isDifferent) {
                // Update existingItem with new values
                Object.assign(existingItem, newItem);
            }
        } else {
            mergedData.push(newItem);
        }
    }
    return mergedData;
}

function createTable( sortBy ) {
    document.querySelectorAll(".cntTablaServant").forEach( div => div.remove() );
    const unSortedServants = sortServants(sortBy);
    const sortedServants = {};
    if( sortBy === "class")
        Object.keys( unSortedServants ).sort().forEach(key => {
            sortedServants[key] = unSortedServants[key];
        });
    else
        Object.keys( unSortedServants ).sort().reverse().forEach(key => {
            sortedServants[key] = unSortedServants[key];
        });
    if( sortBy === "rarity" ){
        totalServants[ "All" ] = 0;
        Object.entries( sortedServants ).forEach(([category, items]) => {
            totalServants[ category[0] ] = items.length;
            totalServants[ "All" ] += items.length;
            nServants[ category[0] ] = items.filter( item => item.copies !== 0).length;
        } );
        totalOwnServants = Object.values( nServants ).reduce((a, b) => a + b, 0);
    }
    Object.entries( sortedServants ).forEach(([category, items]) => {
        if( /^\d/.test(category))
            category = category + "⭐";
        let newDiv = document.createElement("div");
        let data =
        `<div class="cntTablaServant" id="Tabla_${category}">
            <table class="table table-striped table-bordered tablaRarezas" rarity="Tabla_${category}">
                <thead id="${category}">
                    <th>
                        ${category}
                    </th>
                    <button type="button" class="btn btn-outline-dark guardar material-symbols-outlined" title="Descargar sección" > 
                        <span class="material-symbols-outlined">
                            download
                        </span> 
                    </button>
                </thead>
                <tbody>
                    <tr class="cntServants">`;
                    items.forEach(servant => {
                        data +=
                            `<td>
                                <div class="cntIconServant${servant.copies != 0 ? " active" : ""}" rarity="${category.charAt(0)}" title="${servant.name}" data-np="${servant.copies != 0 ? servant.copies : ""}" game_id="${servant.game_id}">
                                    <img src="${servant.imgpath}" alt="${servant.name}" loading="lazy"
                                        class="servantIcon${servant.copies != 0 ? "" : " disabled"}">
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
    addIcons();
    addEvents();
}
function addIcons(){
    // Add icons to some servants 
    document.querySelectorAll('.tipo_2').forEach(servant => {
        servant.src = "./img/padlock.png";
    }), document.querySelectorAll('.tipo_3').forEach(servant => {
        servant.src = "./img/estrella.png";
    }), document.querySelectorAll('.tipo_4').forEach(servant => {
        servant.src = "./img/giftbox.png";
    });
}
function addEvents(){
    // Take screenshot of section and save it as a png
    document.querySelectorAll(".guardar").forEach( btn => btn.addEventListener("click", (e) => {
        html2canvas( e.target.closest(`div`).querySelector(`[rarity]`), {useCORS: true} )
        .then( (canvas)  => {
            saveAs(canvas.toDataURL('image/png'), 'servants.png');
        });
    }));
    document.querySelectorAll(".cntIconServant").forEach( img => {
        img.addEventListener("contextmenu", e => {  // Rest one to the servant count
            const info = servantsData.find( servant => servant.game_id === img.getAttribute('game_id') );
            let veces = info["copies"];
            if(veces === 1){
                nServants[ info["rarity"] ] --;
                totalOwnServants --;
                img.firstElementChild.classList.add("disabled");
                img.classList.remove("active");
                img.setAttribute('data-NP', '');
                info["copies"] = 0;
            }
            if(veces > 1){ 
                img.setAttribute('data-NP', veces -= 1);
                info["copies"]-=1;
            }
            updateFields(); 
            saveOnBrowser();
            e.preventDefault();
        });
        img.addEventListener("click", () => {    // Add one to the servant count
            const info = servantsData.find( servant => servant.game_id === img.getAttribute('game_id') );
            let veces = info["copies"];
            img.firstElementChild.classList.remove("disabled");
            img.classList.add("active"); 
            if (veces === 0){
                img.setAttribute('data-NP', 1);
                nServants[ info["rarity"] ] ++;
                totalOwnServants ++;
                info["copies"] = 1;
            }
            else if(veces < 5){ 
                img.setAttribute('data-NP', veces + 1)
                info["copies"]++;
            };
            updateFields(); 
            saveOnBrowser();
        });
    });
}