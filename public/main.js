document.querySelector("button").addEventListener("click", getBrewery);

let city = document.querySelector(".brewery_input").value;

let brewList = document.getElementById("brewPlaces");

const favoriteBreweries = document.getElementById('favorite-brew-places')

const initialBrewListText = document.getElementById('initial-text')

// create global array to be able to access the objects and loop through to create
// new array for favorites

const breweryArray = []


const moveFavoritesBtn = document.getElementById('move-to-favorites')

document.getElementById("coordinates-btn").addEventListener("click", getCoords);

const coordsArray = [];




// FAVORITES BUTTON


moveFavoritesBtn.addEventListener('click', () => {
  const checkedBrewery = document.querySelectorAll('input[type="checkbox"]:checked')
  const favoritesArray = []
  
    for(let i = 0; i<checkedBrewery.length; i++) {
      
      
      if(checkedBrewery){
        favoritesArray.push(checkedBrewery[i].closest('li').outerHTML)
        favoriteBreweries.innerHTML =`
        <li>
          ${favoritesArray.join('')}
          </li>
          
        ` 
      }
        
    }
    console.log(favoritesArray)
    

  
  
  
})



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

          let ul_URL = document.getElementById("brew_url");

          let ul = document.getElementById("brewPlaces");

          for (let i = 0; i < breweries.length; i++) {
            ul.textContent = ''
            let li = document.createElement("li");
            let url_li = document.createElement("li");

           // Creating link for breweries and appending to DOM

           

            let a = document.createElement("a");

            let link = document.createTextNode(breweries[i]);

            if (breweries.name != li.textContent) {
              a.appendChild(link);
              a.title = breweries;
              a.href = brewing_url[i] || "#";
              li.appendChild(a);
              ul.appendChild(li);
            } else {
              console.log("this brewery is already in this list");
            }
          }
        });
    });
  } else {
    console.log("Geolocation is not available");
  }
}



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

      let ul_URL = document.getElementById("brew_url")

      let ul = document.getElementById("brewPlaces")

      for (let i = 0; i < breweries.length; i++) {
        let li = document.createElement("li")
        let url_li = document.createElement("li")
        let input = document.createElement('input')
        breweryArray.push(data[i])
        input.type = 'checkbox'
        input.setAttribute('id', breweries[i])
        input.classList.add('brewery-checkbox')
                // Creating link for breweries and appending to DOM

        let a = document.createElement("a")
        a.setAttribute("for", breweries[i])

        let link = document.createTextNode(breweries[i])

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

// Create section for Untappd API that returns extended information about the brewery
// using URL - https://api.untappd.com/v4/brewery/info/BREWERY_ID
