let map;
let infowindow;

function initMap(){
    //on va récupérer la map dans notre api google map et l'injecter dans div #map, on va le positionner sur une coordonnée par défaut (center) et lui donner un zoom
    map = new google.maps.Map(document.getElementById("map"),{
        center: { lat: -34.397, lng: 150.644 },
        zoom: 13,
      });
      //si le navigateur supporte la geoloc
      if(navigator.geolocation){
        //on récupère la position de l'utilisateur
        navigator.geolocation.getCurrentPosition(function(position){
            //je recupère ma position
            console.log(position)
            let pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            //on recentre la map sur notre position
            map.setCenter(pos)
            //GESTION DU MARKER
            //on va définir la position de notre marker
            let myLatLng = new google.maps.LatLng(pos.lat, pos.lng);
            
            //création du marker avec les options (position, icon...)
            let myMarker = new google.maps.Marker({
              position: myLatLng,
              map: map,
              icon: 'http://www.robotwoods.com/dev/misc/bluecircle.png'
            })
            
            let infoWindow = new google.maps.InfoWindow();
            //positionne la popup sur notre geoloc
            infoWindow.setPosition(pos);
            //création du contenu de la popup
            infoWindow.setContent("<h3>Chez moi!</h3><p>L'apero c'est ici!!!</p>");
            //ajout d'un écouteur d'événément click pour ouvrir la popup
            myMarker.addListener("click", () => {
              //ouverture de la popup
              infoWindow.open({
                  anchor: myMarker,
                  map,
                  shouldFocus: false,
                });
            })
        })
      }else{
          alert("Bouh pas de géoloc hahahhahaa")
      }
}