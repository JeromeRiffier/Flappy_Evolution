//ICI se trouve toute les fonction relative au chargement et sauvegarde des joueur en JSON
//Sachant qu'on cherche encore a :
//Pouvoir les charger pour un 1VS1


//On stockera tout ici
let json_players = [];
let json_players_brains_models = [];
var nbr_fichier_a_traiter = 0;
var nbr_fichier_deja_traiter = 0;

//Pouvoir enregistrer le meilleur joueur de la gen precedente
function select_best_last_player() {
    var player_selected;
    if (players.length >0) {
        for (let index = 0; index < players.length; index++) {
            if (players[index].wasBest == true) {
                player_selected=players[index];
            }
        }
    }else{
        for (let index = 0; index < saved_players.length; index++) {
            if (players[index].wasBest == true) {
                player_selected=players[index];
            }
        }
    }
    
    return player_selected;
}

//Pouvoir enregistrer le meilleur joueur en cour
function select_best_actual_player() {
    var player_selected;
    var res ;
    if (players.length >0) {
        res = Math.max.apply(Math, players.map(function(player) { return player.score; }))
        player_selected = players.find(function(player){ return player.score == res; })    
    }else{
        res = Math.max.apply(Math, saved_players.map(function(player) { return player.score; }))
        player_selected = saved_players.find(function(player){ return player.score == res; })
    }
    
    return player_selected;
}

//Charger un fichier JSON depuis la page  
function import_JSON_from_client (){
    //On import les fichiers de puis "<input type="file" id="selectFiles" value="Import" />"  dans le tableaux files
    let files = []
    files = document.getElementById('selectFiles').files;
    if (files.length <= 0) {
        return false;
    }
    nbr_fichier_a_traiter = files.length;
    //On loop a travers les fichier pour en extraire les infos dont on a besoin
    for (var i = 0; i < files.length; i++) { //for multiple files          
        (function(file) {
            var name = file.name.split('.').shift()
            var ext = files[i].name.split('.').pop()
            var reader = new FileReader();  
            reader.onload = function(e) {  
                // get file content  
                //print('fichier : '+name)
                //print('extension : '+ext)

                //On gere l'import du tableau de joueurs (sans les cervaux)
                if (name == "players") { 
                    nbr_fichier_deja_traiter +=1;
                    //Result = contenut brut du fichier json (deja formaté normalement)
                    var result = JSON.parse(e.target.result);
                    // json_player_temp permet de stocké les eventuel joueur deja enregistrer avant de remplacé par result
                    var json_players_temp = []
                    if (json_players != ""){
                        json_players_temp = json_players
                    }
                    // On ecrase les valeur de json_player
                    json_players = JSON.parse(e.target.result);
                    //On informe l'utilisateur
                    //on return si il n'y avais pas de contenut dans json_players au depart
                    if (json_players_temp == "") { return }
                    //Sinon on les ajoutes au players importé
                    for (let index = 0; index < json_players_temp.players.length; index++) {
                        json_players.players[json_players.players.length] = json_players_temp.players[index];
                    }
                    transfert_brains()//<- on tente de synchronisé les cervaux avec les json_players
                    alert("import réussi de "+json_players.players.length+ " joueurs, vous avez donc "+json_players.players.length+ " joueurs enregistré")
                    //alert("Vous avez donc "+json_players.players.length+ " joueurs enregistré !")
                }else{
                    return 
                }
            }
            reader.readAsText(file, "UTF-8");
        })(files[i]);
        if(files[i].name.split('.').shift() != 'players' && files[i].name.split('.').pop() == "json"){
            //print("maintenant on integre le cervaux de "+name)
            //async_import_model(files[i], files[i+1])
            //loadModel(files[i])
            import_model(files[i].name.split('.').shift(), files[i], files[i+1]);
        }
    }
}

//Import du model + Insertion de ces models dans le tableau json_players_brains_models  (apparement fonctionnel)
async function import_model(id, json, bin){
    var model = await tf.loadLayersModel(
    tf.io.browserFiles([json,bin]));
    json_players_brains_models[id]= model
    nbr_fichier_deja_traiter +=2 // <- le .json + le .bin
    transfert_brains()//<- on tente de synchronisé les cervaux avec les json_players
    //console.log("Model loaded for "+id)
} 

//envoyé les models de  Json_players_brains_models dans les brains de json_players   !UNE FOIS QUE TOUT LE MONDE A TOUT CHARGER!
function transfert_brains(){
    if (nbr_fichier_a_traiter == nbr_fichier_deja_traiter) {
        for (let i = 0; i < json_players.players.length; i++) {
            json_players.players[i].brain = new NeuralNetwork(5, 8,2)
            json_players.players[i].brain.model = json_players_brains_models[json_players.players[i].id]
        }
    }else{
        return
    }
}

//Renvoi les 2 fichier d'export d'un cerveau (brain) le model.json et les weight.bin mais pas le reste des info de l'objet player
//Le reste des info se trouve dans le fichier players.json generé par save_json_file()
//On fais commencé le nom par z pour qu'il soit classé apres le tableau Players (pas optimal mais suffisant pour ce projet)
async function async_export_model(player) {
    await player.brain.model.save('downloads://'+player.id)
    return
}

//Ajoute un joueurs dans la liste des joueurs a sauvegardé
function store_a_player(player){
    //On demande si faut le renomer :
    name = name_it();
    if(name !=""){
        player.name = name
    }
    if (json_players != "") {
        //Nbr de joueur stocké
        var nbr = json_players.players.length
        json_players.players[nbr] = player
    }else{
        json_players = {'players':[player] }
    }
}

//Creation du fichier JSON avec tout les joueurs + Lancement du telechargement sur l'ordi du client
function save_json_file(){
    alert('Vous allez recevoir plusieur fichier\nConseil : Creer un dossiers special pour ne pas les melanger/perdres')
    //await json_players.players[0].brain.model.save('downloads://my-model');
    //Pour chacque players[] dans json_players on lance la sauvegarde du cerveau en premier
    json_players.players.forEach(player => {
        async_export_model(player)
    });
    
    //Puis  on sauvegarde le tableau de joueurs de json_players
    json_players = JSON.stringify(json_players)
    //On enregistre le-dit tableaux dans le fichier players.json
    //ce tableau contient les info des object "players" mais pas leur cervaux (qui ont été exporté dans async_export_model(player))
    var blob = new Blob([json_players], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "players.json");
    json_players = JSON.parse(json_players)

}

//Championnat
function championnat(){
    best_score_storage = [];
    obstacles = [];
    players = [];   // #Birds[] toi-même tu sais^^
    saved_players = [];
    counter = 0;
    running = true
    createCanvas(level.width, level.height)
    level.create_player(json_players.players.length)
    for (let index = 0; index < json_players.players.length; index++) {
        var temp = json_players.players[index]
        temp.is_alive = true
        players[index] = Object.assign(players[index], temp)
    }
    level.reset()
}

//1VS1
function VS(id){
    best_score_storage = [];
    obstacles = [];
    players = [];   // #Birds[] toi-même tu sais^^
    saved_players = [];
    counter = 0;
    running = true
    level.create_player(1)
    for (let index = 0; index < json_players.players.length; index++) {
        if (json_players.players[index].id == id) {
            var temp = json_players.players[index]
            temp.is_alive = true
            players[0] = Object.assign(players[0], temp)
        }
    }
    players.push(new player(false))
    players[1].y = int(random(0,level.height))
    level.player_alive =2
    level.reset()
    
}

//Pouvoir leur donnée un ptit nom ;)
function name_it(){
    var name = prompt("Comment voulez vous le nommer ?", proposition_name[Math.floor(Math.random() * proposition_name.length)]);
    if (name != null) {
        return name;
    }
    return false
}