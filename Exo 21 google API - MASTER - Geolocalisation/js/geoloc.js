let map, infoWindow;
//let query = "restaurant";

//on enregistre dans une variable un icone pour notre geoloc
let im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';

function initMap() {
    
    //on initialise la map avec une position d'origine en appliquant celle ci dans la div d'affichage
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 13
    });
    //on crée la fenêtre d'infos
    infoWindow = new google.maps.InfoWindow;
    //condition si le navigateur détecte tes coordonnées avec navigator.geolocation
    if (navigator.geolocation) {
        //on récupère la position acturelle et on y enferme l'objet contenant la latitude et la longitude dans la variable pos
        navigator.geolocation.getCurrentPosition(function(position) {
            let pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
        
            //on recentre la map sur votre position actuelle
            map.setCenter(pos);
            //on attribut le latitude longitude à la map (pout le marker)
            let myLatLng = new google.maps.LatLng(pos.lat, pos.lng);
            //on créer le marker sur votre position  en y insérant l'icon perso
            let userMarker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: im
            });
            //création de deux markers test si vous voulez mêtre un endroit spécifique sur la map dans votre site perso (FACULTATIF)
            /*let otherLat =new google.maps.LatLng(48.875814, 2.328800);
            let marker = new google.maps.Marker({position: otherLat, map: map});
            let homePos = new google.maps.LatLng(48.884072, 2.360619);
            let markerHome = new google.maps.Marker({position: homePos, map: map});*/
            
            //initialisation de la librairie searchbox
            let searchBox = new google.maps.places.SearchBox(search);
            let places = searchBox.getPlaces()
       
            //écouteur d'événement de changement sur les résultats de la SearchBox vers la fenêtre d'affichage de la carte actuelle
            map.addListener('bounds_changed', function() {
              console.log("bounds changed")
              searchBox.setBounds(map.getBounds());
            });
            //on crée un tableau vide pour les markers
            let markers = [];
            // Récupère les infos lorsque l'utilisateur sélectionne une prédiction (écouteur d'événement)
            //ici on peut limiter ses suggestions.
            searchBox.addListener('places_changed', function() {
                //récupération des places
                let places = searchBox.getPlaces();
                console.log("places_changed",places)
            
                //si il n'en trouve pas on sort de la fonction (return)
                if (places.length == 0) {
                    return;
                 }
                // On efface les anciens markers.
                markers.forEach(function(marker) {
                    marker.setMap(null);
                });
                markers = [];
                //appel de la fonction LatLng que l'on stock dans une variable
                let bounds = new google.maps.LatLngBounds();
                // On fait une boucle forEach pour récuperer les locations.
                places.forEach(function(place) {
                    //si le shop ne possède pas de coordonnées
                    if (!place.geometry) {
                        //console.log
                        console.log("Returned place contains no geometry");
                        //return  pour sortir de la fonction
                        return;
                    }
                    //on crée un model d'icon avec ses options
                    let icon = {
                      url: place.icon,
                      size: new google.maps.Size(71, 71),
                      origin: new google.maps.Point(0, 0),
                      anchor: new google.maps.Point(17, 34),
                      scaledSize: new google.maps.Size(25, 25)
                    };
                    
                    let myMarker = new google.maps.Marker({
                      map: map,
                      icon: icon,
                      title: place.name,
                      position: place.geometry.location
                    })
                    let markerPopUp = new google.maps.InfoWindow();
                    //positionne la popup sur notre geoloc
                    markerPopUp.setPosition(pos);
                    //création du contenu de la popup
                    markerPopUp.setContent(`<h3>${place.name}</h3>
                                            <p>${place.formatted_address}</p>
                                            <p>${place.formatted_phone_number}</p>`);
                    //ajout d'un écouteur d'événément click pour ouvrir la popup
                    myMarker.addListener("click", () => {
                      //ouverture de la popup
                      markerPopUp.open({
                          anchor: myMarker,
                          map,
                          shouldFocus: false,
                        });
                    })
                    // Créaction des markers pour tous les lieux trouvé sur la recherche
                    markers.push(myMarker);
                    //si il y'a une geocode il rezoom et recentre bien
                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    }else{
                        //sinon il reste sur sa position
                        bounds.extend(place.geometry.location);
                    }
                })   
                //renvoi vers le bon lieu
                map.fitBounds(bounds);
            })   
        //sinon (navigateur supporte pas la geoloc mais erreur de positionnement)
        }, function(){
            //appel de la fonction d'erreur, on envoi le message et on centre la map
            handleLocationError(true, infoWindow, map.getCenter())
        })
    //sinon (navigateur ne supporte pas la geoloc)
    }else{
        //appel de la fonction d'erreur, on envoi le message et on centre la map
        handleLocationError(false, infoWindow, map.getCenter())
    }       
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
}

function recupVal(e) {
    //on enlève le comportement par défaut du navigateur
    e.preventDefault()
    //on récup la valeur du champ de formulaire on sauvegarde dans la variable globale search
    const search = document.getElementById("search").value;
    console.log(search);
}