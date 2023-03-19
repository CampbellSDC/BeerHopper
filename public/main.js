document.querySelector("button").addEventListener("click", getBrewery);

let city = document.querySelector(".brewery_input").value;

let brewList = document.getElementById("brewPlaces");

const favoriteBreweries = document.getElementById('favorite-brew-places')

const initialBrewListText = document.getElementById('initial-text')

const initialFavoritesText = document.getElementById('favorites-initial-text')

const moveFavoritesBtn = document.getElementById('move-to-favorites')

document.getElementById("coordinates-btn").addEventListener("click", getCoords);

const removeBreweryBtn = document.getElementById('remove-brewery-btn')

const breweryArray = []

const coordsArray = []

const favoritesArray = [] //this needed to be a global array so it didn't get reset when there was a new search



// need to add to local storage as well

// Issue 1 - remove selected 'li' from "Favorites" list
// Issue 2 - "move to favorites" button moves selected breweries multilple times 
// with geolocation 




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

      

      let ul = document.getElementById("brewPlaces")

      for (let i = 0; i < breweries.length; i++) {
        let li = document.createElement("li")

        let input = document.createElement('input')
        input.type = 'checkbox'
        input.setAttribute('data-name', breweries[i])
        input.classList.add('brewery-checkbox')

        let a = document.createElement("a")
        li.setAttribute("id", breweries[i])


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



// Issue - breweries are only moved to favorites list on first click and checkboxes or only unchecked 
// the first time move to favorites is clicked. If you add another checked brewery, the
// all of the breweries are then added, but only the new brewery is unchecked under
// Brewery Name

moveFavoritesBtn.addEventListener('click', () => {
  const checkedBrewery = document.querySelectorAll('.brewery-checkbox')
  const checkedArray = Array.from(checkedBrewery)

  
  

 
  
  initialFavoritesText.classList.add('hide-text')

  
    for(let i = 0; i<checkedArray.length; i++) {
      
      
      
      if(checkedArray[i].checked && !favoritesArray.includes(checkedArray[i].closest('li').outerHTML)){

          checkedArray[i].classList.add('favorites-checkbox')

          favoritesArray.push(checkedArray[i].closest('li').outerHTML)
        
       
          favoriteBreweries.innerHTML = favoritesArray.join('')
          
          removeBreweryBtn.classList.remove('hide-text')

          checkedArray[i].checked = !checkedArray[i].checked
          
      }
      
    }
    
    
    

  
  
  
})

//REMOVE FAVORITE BREWERY





removeBreweryBtn.addEventListener('click', removeBrewery)

function removeBrewery() {
  
  
  const checkedFavorite = document.querySelectorAll('ul#favorite-brew-places > li > input')
  const checkedFavoriteArray = Array.from(checkedFavorite)
  

  checkedFavoriteArray.forEach((checkbox) => {
    
    if (checkbox.checked){
     
      const li = checkbox.closest('li')
      favoriteBreweries.removeChild(li)
      checkedFavoriteArray.splice(checkedFavoriteArray.checked,checkedFavoriteArray.checked )
      favoritesArray.splice(li, 1)
      
      if(checkedFavoriteArray.length == 0){
        initialFavoritesText.classList.remove('hide-text')
        removeBreweryBtn.classList.add('hide-text')
      }
    }


    
  })
   console.log(checkedFavoriteArray)
  
  
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
          
        })
            
      })
  } else {
    console.log("Geolocation is not available")
  }
}





// Create section for Untappd API that returns extended information about the brewery
// using URL - https://api.untappd.com/v4/brewery/info/BREWERY_ID
