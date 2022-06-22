let map; //! On inject la map ici
let infoWindow; //! Avec ça on fera les popup

//let query = "restaurant"; //!Nos resultat de recherche

//on enregistre dans une variable un icone pour notre geoloc
let im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';

function initMap() {
    
    //on initialise la map avec une position d'origine en appliquant celle ci dans la div d'affichage
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 12
    });
    
    //on crée la fenêtre d'infos popup
    let infoWindow = new google.maps.InfoWindow;
    //condition si le navigateur détecte tes coordonnées avec navigator.geolocation
    if (navigator.geolocation){
        //on récupère la position acturelle et on y enferme l'objet contenant la latitude et la longitude dans la variable pos
        navigator.geolocation.getCurrentPosition((position) => {
        
        //on recentre la map sur votre position actuelle
        let myCurrentPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            }
        //on attribut le latitude longitude à la map (pout le marker)
        map.setCenter(myCurrentPosition)

        //on créer le marker sur votre position en y insérant l'icon perso
        let myCurrentPositionForMarkers = new google.maps.LatLng   (myCurrentPosition.lat, myCurrentPosition.lng)
        
        let userMarker = new google.maps.Marker({
            position: myCurrentPositionForMarkers,
            map: map
        })
        //création de deux markers test si vous voulez mêtre un endroit spécifique sur la map dans votre site perso (FACULTATIF)
       /* let positionCarrefour = new google.maps.LatLng(45.759232, 4.888126);
        let markerCarfour = new google.maps.Marker({position: positionCarrefour, map : map});

        let positionCastorama = new google.maps.LatLng(45.757931, 4.882315);
        let markerCastorama = new google.maps.LatLng({position: positionCastorama, map: map});*/
        
        //initialisation de la librairie searchbox
        const searchBoxInput = new google.maps.places.SearchBox(search)
        const placesRequest = searchBoxInput.getPlaces();
        //écouteur d'événement de changement sur les résultats de la SearchBox vers la fenêtre d'affichage de la carte actuelle
        //! agregamos un listener, que cuando agregamos algo en el boxInput este nos dara proposiciones
        map.addListener("bounds_changed", () => {
            searchBoxInput.setBounds(map.getBounds());
        });
        //on crée un tableau vide pour les markers
        let markers = [];
        // Récupère les infos lorsque l'utilisateur sélectionne une prédiction (écouteur d'événement)
        //ici on peut limiter ses suggestions.
        //! Cuando clickeamos en una proposicion del boxInput, este nos dara un max de 20 proposiciones cerca de nuestra ubicacion
        searchBoxInput.addListener("places_changed", () => {
            //récupération des places
            const newPlaces = searchBoxInput.getPlaces();
            console.log(newPlaces);
            //si il n'en trouve pas on sort de la fonction (return)
            if(newPlaces.length == 0) {
                return
            };
            // On efface les anciens markers.            
            markers.forEach((Marker) => {
                 Marker.setMap(null);
            });
            markers = [];
            //appel de la fonction LatLng que l'on stock dans une variable
            const bounds = new google.maps.LatLngBounds();
            
            // On fait une boucle forEach pour récuperer les locations.
            newPlaces.forEach((place) => {
                //si le shop ne possède pas de coordonnées
                if(!place.geometry) {
                    //console.log
                    console.log("Returned places no contains geolocalisation");
                    //return  pour sortir de la fonction
                    return;
                }       
                //on crée un model d'icon avec ses options
                const icon = {
                    url: place.icon,
                    size: new google.maps.Size(71,71),
                    origin: new google.maps.Point(0,0),
                    anchor: new google.maps.Point(17,34),
                    scaledSize: new google.maps.Size(25,25),
                }
                // Créaction des markers pour tous les lieux trouvé sur la recherche
                markers.push(
                    new google.maps.Marker({
                        map,
                        icon,
                        title: place.name,
                        position: place.geometry.location,
                    })
                )

                //si il y'a une geocode il rezoom et recentre bien
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    //sinon il reste sur sa position
                    bounds.extend(place.geometry.location)
                }
            });    
            //renvoi vers le bon lieu
            map.fitBounds(bounds);
            });
        }, function(){
            //erreur getCurrentPosition callback
            //appel de la fonction d'erreur, on envoi le message et on centre la map
            handleLocationError(true, infoWindow, map.getCenter())
        })    
    } else {    
        //sinon (navigateur ne supporte pas la geoloc)
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