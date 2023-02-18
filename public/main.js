document.querySelector("button").addEventListener("click", getBrewery);

let city = document.querySelector(".brewery_input").value;

let brewList = document.getElementById("brewPlaces");

const favoriteBreweries = document.getElementById('favorite-brew-places')

const initialBrewListText = document.getElementById('initial-text')

const initialFavoritesText = document.getElementById('favorites-initial-text')

const moveFavoritesBtn = document.getElementById('move-to-favorites')

document.getElementById("coordinates-btn").addEventListener("click", getCoords);

const breweryArray = []

const coordsArray = []

const favoritesArray = [] //this needed to be a global array so it didn't get reset when there was a new search

const removeFavoriteBreweryBtn = document.getElementById('remove-brewery-btn')

// need to add to local storage as well



// GET BREWERY FROM USER CITY INPUT

function getBrewery() {
  let city = document.querySelector(".brewery_input").value;

  let brewName = document.querySelector(".brewery_name");

  let url = `https://api.openbrewerydb.org/breweries?by_city=${city}`;

  initialBrewListText.classList.add('hide-text')

  brewList.innerHTML = "";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      let breweries = data.map((elem) => elem.name);

      let brewing_url = data.map((elem) => elem.website_url)

      // let ul_URL = document.getElementById("brew_url") commented out because it's not used anywhere

      let ul = document.getElementById("brewPlaces")

      for (let i = 0; i < breweries.length; i++) {
        let li = document.createElement("li")

        let input = document.createElement('input')
        input.type = 'checkbox'
        input.setAttribute('id', breweries[i])
        input.classList.add('brewery-checkbox')

        let a = document.createElement("a")
        a.setAttribute("for", breweries[i])

        let link = document.createTextNode(breweries[i])
        // let url_li = document.createElement("li") commented out because it's not used anywhere
        
        breweryArray.push(data[i])
        

                // Creating link for breweries and appending to DOM
        a.appendChild(link)
        a.title = brewing_url[i] || "#"
        a.href = brewing_url[i]
        li.appendChild(a)
        li.appendChild(input)
        ul.appendChild(li)
      }
      console.log(breweryArray)
    })

    .catch((err) => {
      console.log(`Error! ${err}`);
    });
}

// FAVORITES BUTTON





moveFavoritesBtn.addEventListener('click', () => {
  const checkedBrewery = document.querySelectorAll('input[type="checkbox"]:checked')
  
  initialFavoritesText.classList.add('hide-text')

  
    for(let i = 0; i<checkedBrewery.length; i++) {
      
      
      if(checkedBrewery && favoritesArray[i] != checkedBrewery[i].closest('li').outerHTML ){
        
        favoritesArray.push(checkedBrewery[i].closest('li').outerHTML)
       
          favoriteBreweries.innerHTML =`
          <li>
            ${favoritesArray.join('')}
            </li>

            <button id="remove-brewery-btn">Remove Brewery</button>
            
          `
        
      }
        
    }
    console.log(favoritesArray)
    

  
  
  
})

//REMOVE FAVORITE BREWERY

removeFavoriteBreweryBtn.addEventListener('click', removeBrewery)

function removeBrewery() {
  
}



// GET BREWERIES FROM GEOLOCATION

function getCoords() {
  if ("geolocation" in navigator) {
    initialBrewListText.classList.add('hide-text')
    document.getElementById("longitude").textContent = "";

    document.getElementById("latitude").textContent = "";
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      // API latitude/longitude
      let coordsURL = `https://api.openbrewerydb.org/breweries?by_dist=${lat},${long}&per_page=10`;
      document.getElementById("longitude").textContent += long.toFixed(3);
      document.getElementById("latitude").textContent += lat.toFixed(3);
      brewList.textContent = ''
      console.log(position);

      const data = { lat, long };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      console.log('about to fetch')
      try {const response = await fetch("/api", options);
      const json = await response.json();
      
      console.log(json);
      coordsArray.push(json);
      console.log(coordsArray);}
      catch (e){console.log("Copy error")}

      fetch(coordsURL)
        .then((res) => {
          console.log({ res });
          return res.json();
        })

        .then((data) => {
          console.log(data);
          
          let breweries = data.map((elem) => elem.name);

          let brewing_url = data.map((elem) => elem.website_url);

          let ul = document.getElementById("brewPlaces");

        

          for (let i = 0; i < breweries.length; i++) {
            let li = document.createElement("li")
    
            let input = document.createElement('input')
            input.type = 'checkbox'
            input.setAttribute('id', breweries[i])
            input.classList.add('brewery-checkbox')
    
            let a = document.createElement("a")
            a.setAttribute("for", breweries[i])
    
            let link = document.createTextNode(breweries[i])
            // let url_li = document.createElement("li") commented out because it's not used anywhere
            
            breweryArray.push(data[i])
            
    
                    // Creating link for breweries and appending to DOM
            a.appendChild(link)
            a.title = brewing_url[i] || "#"
            a.href = brewing_url[i]
            li.appendChild(a)
            li.appendChild(input)
            ul.appendChild(li)
          }
          console.log(breweryArray)
        })
            
      })
  } else {
    console.log("Geolocation is not available")
  }
}





// Create section for Untappd API that returns extended information about the brewery
// using URL - https://api.untappd.com/v4/brewery/info/BREWERY_ID
