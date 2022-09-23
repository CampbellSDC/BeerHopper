




document.querySelector('button').addEventListener('click', getBrewery)

let city = document.querySelector('.brewery_input').value

let brewList = document.querySelector('#brewPlaces')

document.getElementById('coordinates-btn').addEventListener('click', getCoords)

const coordsArray = []

function getCoords(){
    if ('geolocation' in navigator) {

            document.getElementById('longitude').textContent =''

            document.getElementById('latitude').textContent =''

        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude
            const long = position.coords.longitude
            let coordsURL = `https://api.openbrewerydb.org/breweries?by_dist=${lat},${long}&per_page=10`
            document.getElementById('longitude').textContent += long.toFixed(3)
            document.getElementById('latitude').textContent += lat.toFixed(3)
            console.log(position);

            const data = {lat, long}
            const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
                }

            
            const response = await fetch('/api', options)
           const json = await response.json()
           console.log(json)
           coordsArray.push(json)
           console.log(coordsArray)

    fetch(coordsURL)
            .then(res => res.json())
            .then(data => {
                
                console.log(data)

                let breweries = data.map(elem => elem.name)
    
                let brewing_url = data.map(elem => elem.website_url)

                let ul_URL = document.getElementById('brew_url')

                let ul = document.getElementById('brewPlaces')

                

    for(let i = 0; i<breweries.length; i++){
        // ul.textContent = ''
        let li = document.createElement('li')
        let url_li = document.createElement('li')

//         // Creating link for breweries and appending to DOM

        let a = document.createElement('a')

        let link = document.createTextNode(breweries[i])

       
            if (breweries.name != li.textContent){
            a.appendChild(link)
            a.title = breweries
            a.href = brewing_url[i] || '#'
            li.appendChild(a)
            ul.appendChild(li)

            } else {
                console.log('this brewery is already in this list')
            }
            }
    

                
            })
});

} else {
console.log('Geolocation is not available')
}
}



function getBrewery(){
    let city = document.querySelector('.brewery_input').value

    let brewName = document.querySelector('.brewery_name')

    let url = `https://api.openbrewerydb.org/breweries?by_city=${city}`

    brewList.innerHTML = ''


fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data)

    let breweries = data.map(elem => elem.name)
    
    let brewing_url = data.map(elem => elem.website_url)

    let ul_URL = document.getElementById('brew_url')

    let ul = document.getElementById('brewPlaces')
    
    for(let i = 0; i<breweries.length; i++){
        let li = document.createElement('li')
        let url_li = document.createElement('li')

//         // Creating link for breweries and appending to DOM

        let a = document.createElement('a')

        let link = document.createTextNode(breweries[i])

        
        a.appendChild(link)
        a.title = breweries
        a.href = brewing_url[i] || '#'
        li.appendChild(a)
        ul.appendChild(li)
       
    }
  
     
    })

    .catch(err => {
        console.log(`Error ${err}`)
    })
}


// Create section for Untappd API that returns extended information about the brewery
// using URL - https://api.untappd.com/v4/brewery/info/BREWERY_ID


