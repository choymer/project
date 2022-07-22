// Api url
export const api_url = "https://run.mocky.io/v3/7cb595ed-2882-4dc7-8179-d38d0b9c9d13";

// Global variables
const arrayOfCompanies = [];

// Defining async function
async function getapi(url) {

    // Storing response
    const response = await fetch(url);

    // Storing data in form of JSON
    const data = await response.json();
    if (response) {
        hideloader();
    }
    show(data);
}
// Calling that async function
getapi(api_url);

// Function to hide the loader
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}

// Function to define innerHTML for HTML table
function show(data) {
    let tab =
        `<tr>
		<th>Company</th>
		<th>Sector</th>
		<th>Address</th>
        <th>Fees</th>
		</tr>`;

    // Loop to access all rows
    for (let r of data) {
        tab += `<tr>
	<td>${r.company}</td>
	<td>${r.sector}</td>
	<td>${r.address}</td>	        
    <td>${r.fees.amount} ${r.fees.currency}</td>	
    </tr>`

        // Save coordinates and company info on an array.
        arrayOfCompanies.push({
            "latitude": r.location.latitude,
            "longitude": r.location.longitude,
            "company": r.company,
            "sector": r.sector,
            "address": r.address
        })

    }
    // Calling initMap
    initMap()
    // Setting innerHTML as tab variable.
    document.getElementById("companies").innerHTML = tab;
}

function initMap() {

    const myLatlng = {
        lat: -25.363,
        lng: 131.044
    };

    let mapOptions = {
        zoom: 1,
        minZoom: 1,
        center: myLatlng,
    }
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    const bounds = new google.maps.LatLngBounds();

    // Loop to access the coordinates to use a marker on the position.

    arrayOfCompanies.forEach(entity => {
        const position = new google.maps.LatLng(entity.latitude, entity.longitude)
        const marker = new google.maps.Marker({
            position: position,
            map: map,
            optimized: true
        })

        const contentString = `<h1>${entity.company}</h1>
                            <h2>${entity.sector}</h2>
                            <p>${entity.address}</p>`;

        google.maps.event.addListener(marker, "click", function () {
            //create a new InfoWindow instance
            const infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            infowindow.open(map, marker);
        });

        bounds.extend(position);
        map.fitBounds(bounds);

    })

}

window.initMap = initMap;