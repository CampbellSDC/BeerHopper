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

const favoritesArray = [] 







// GET BREWERY FROM USER CITY INPUT

function getBrewery() {
  const city = document.querySelector(".brewery_input").value;
  const url = `https://api.openbrewerydb.org/breweries?by_city=${city}`;

  initialBrewListText.classList.add('hide-text');
  brewList.innerHTML = "";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      data.forEach((brewery) => {
        const li = document.createElement("li");
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.setAttribute('data-name', brewery.name);
        input.classList.add('brewery-checkbox');

        const a = document.createElement("a");
        li.setAttribute("id", brewery.name);

        const link = document.createTextNode(brewery.name);
        
        breweryArray.push(brewery);
        
        a.appendChild(link);
        a.title = brewery.website_url || "#";
        a.href = brewery.website_url;
        li.appendChild(a);
        li.appendChild(input);
        brewList.appendChild(li);
      });

      console.log(breweryArray);
    })
    .catch((err) => {
      console.log(`Error! ${err}`);
    });
}



// FAVORITES BUTTON

moveFavoritesBtn.addEventListener('click', () => {
  const checkedBrewery = document.querySelectorAll('.brewery-checkbox');
  const checkedArray = Array.from(checkedBrewery);

  initialFavoritesText.classList.add('hide-text');

  checkedArray.forEach((checkbox) => {
    if (checkbox.checked && !favoritesArray.includes(checkbox.closest('li').outerHTML)) {
      checkbox.classList.add('favorites-checkbox');
      favoritesArray.push(checkbox.closest('li').outerHTML);
      favoriteBreweries.innerHTML = favoritesArray.join('');
      removeBreweryBtn.classList.remove('hide-text');
      checkbox.checked = !checkbox.checked;
    }
  });

  console.log(typeof favoritesArray[i]);
});



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
      
    }
    if(favoritesArray.length == 0){
      initialFavoritesText.classList.remove('hide-text')
      removeBreweryBtn.classList.add('hide-text')
  }
  

    
  })
   
  
  
}



// GET BREWERIES FROM GEOLOCATION

function getCoords() {
  if ("geolocation" in navigator) {
    initialBrewListText.classList.add('hide-text');
    document.getElementById("longitude").textContent = "";
    document.getElementById("latitude").textContent = "";
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      // API latitude/longitude
      let coordsURL = `https://api.openbrewerydb.org/breweries?by_dist=${lat},${long}&per_page=10`;
      document.getElementById("longitude").textContent += long.toFixed(3);
      document.getElementById("latitude").textContent += lat.toFixed(3);
      brewList.textContent = '';
      console.log(position);

      const data = { lat, long };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      console.log('about to fetch');
      try {
        const response = await fetch("/api", options);
        const json = await response.json();
      
        console.log(json);
        coordsArray.push(json);
        console.log(coordsArray);
      } catch (e) {
        console.log("Copy error");
      }

      fetch(coordsURL)
        .then((res) => {
          console.log({ res });
          return res.json();
        })
        .then((data) => {
          console.log(data);
          
          data.forEach((brewery) => {
            const li = document.createElement("li");
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.setAttribute('id', brewery.name);
            input.classList.add('brewery-checkbox');

            const a = document.createElement("a");
            a.setAttribute("for", brewery.name);

            const link = document.createTextNode(brewery.name);
            
            breweryArray.push(brewery);
            
            a.appendChild(link);
            a.title = brewery.website_url || "#";
            a.href = brewery.website_url;
            li.appendChild(a);
            li.appendChild(input);
            brewList.appendChild(li);
          });
        });
    }); 
  } else {
    console.log("Geolocation is not available");
  }
}


