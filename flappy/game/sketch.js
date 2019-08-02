let total_cobaye = 20;

let best_score_storage = [];
let obstacles = [];
let players = [];   // #Birds[] toi-même tu sais^^
let mutation_rate = 0.1;
let saved_players = [];
let base_hole_size = 100;
let base_space_bewteen = 120;
let counter = 0;
let running = false;

const proposition_name = ['Michel Boujenah','Michel Denisot','Michel Houellebecq','Michel Onfray','Michel Platini','Michel Polnareff','Michel Sardou','Michel Galabru','Michel Cymes','Michel Drucker','Michel Leeb','M. KOHLER','Mme de BAYSER','M. NUSSBAUMER','M. ZAJDENWEBER']



//   Game engine
function setup() {
    frameRate(60) 
    tf.setBackend('cpu');
    level = new level()
    createCanvas(level.width, level.height)
   
    //On precise false sur player pour dire qu'il est jouer par un humain, pour l'IA ne rien mettre   
    //Pour Créer autent d'instance de joueur ia qu'on veut
    level.create_player(total_cobaye)

    //Si on veut crée un vrais joueur jouable    
    /*
    players.push(new player(false))
    players[(players.length)-1].y = int(random(0,level.height))
    level.player_alive +=1
    */
    //On crée le premier obstacle
    obstacles.push(new obtacle(level.hole_size))
    draw_background(true)
}

function draw() {
    
    //Pouvoire faire stop...
    if (!running) return
    draw_background()
    //La c'est le jeux
    if(obstacles.length > 0){
        level.update()
    }else{
        //Nouvelle Partie      
        level.reset()
    }
}

//------------------
class player {
    constructor (ia = true, brain ){
        this.wasBest = false,
        this.name = Math.random().toString(36).substring(2, 15),
        //Id basé sur le timestamp pour ne pas avoir 2X le même quoi qu'il arrive:
        this.id = Date.now();
        
        //Position
        this.y = 0,
        this.x = 40,
        //Taille
        this.height = 30,
        this.width = 30,
        this.radius = 20,
        //Vie
        this.just_dead = false
        this.is_alive = true,
        this.is_ia = ia,
        this.score = 0,
        this.fitness = 0,
        
        this.down_speed = 0,
        this.up_speed = 0
        
        if (brain && this.is_ia == true) {
            this.brain = brain.copy();
        } else if (!brain && this.is_ia == true){
            this.brain = new NeuralNetwork(5, 8, 2);
        }
    }
    //IA Zone  ------  A Aménager !!!!!
    think(obstacles) {
        // Find the closest pipe
        let closest = obstacles[0];
        let closestD = Infinity;
        
        
        /*
        for (let i = 0; i < obstacles.length; i++) {
            let d = obstacles[i].x + obstacles[i].w - this.x;
            if (d < closestD && d > 0) {
                closest = obstacles[i];
                closestD = d;
            }
        }
        */
       let inputs = [];
       inputs[0] = this.y - int(closest.up_height);                      //<----  Diff de hauteur entre player.y et Obstacle_top
       inputs[1] = this.y - int(closest.down_height);                   //<----  Diff de hauteur entre player.y et Obstacle_bottom
       inputs[2] = level.height - this.y;                         //<----  Distance par rapport au sol ?
       inputs[3] = closest.x - this.x;                           //<----  Distance entre player.x et obstacle[0].x
       inputs[4] = this.up_speed -this.up_speed ;               //<----  Vitesse vertical actuel
       let output = this.brain.predict(inputs);
       //if (output[0] > output[1] && this.velocity >= 0) {
           if (output[0] > output[1]) {
               this.move_up();
            }
        }
    dispose() {
        this.brain.dispose();
    }
    mutate() {
        this.brain.mutate(mutation_rate);
    }
    
    //Fin de ZONE IA-----    !!!!!!!!!!!!!!!!!!!!    
    update(){
        //this.move()
        if (keyIsPressed === true) {
            this.move_manual()
        }
        this.gravity()
        if(this.is_alive && this.is_ia){
            this.think(obstacles)
        }
        this.is_it_hit()
    }
    move(){
        if (this.is_alive) {
            if (this.is_alive) {
                if (keyIsPressed === true) {
                    this.move_manual()
                }
                //this.move_ia()
            }
        }else if(this.just_dead==false){
                this.just_dead=true
                level.nbr_joueur_au_sol += 1
                
            }
    }
    move_manual (){
        if (this.is_ia == false && (keyCode === UP_ARROW || key === ' ')) {
            this.move_up()
        }
    }
    move_ia(){
        if (this.is_ia == true && random(0,10) < 2) {
            this.move_up()            
        }
    }
    move_up(){
        if (this.y-(this.height) > 0) {
            if(this.up_speed<30){
                this.up_speed += 2;
            }
            this.down_speed = 0;
            this.y -= this.up_speed;   
        }
    }
    gravity(){
        if(this.down_speed<15){
            this.down_speed +=1;
        }
        if(this.y+(this.height)+this.down_speed < level.height){
            this.y += this.down_speed;
        }
        
    }
    //Gestion hit box
    is_it_hit () {
        if (this.can_it_hit()) {
            if (this.is_up_hit()) {
                this.kill_player()
            }else if (this.is_down_hit()) {
                this.kill_player()
            }
        }
    }
    can_it_hit (){
        if(this.is_alive){
            if(this.x+this.width > obstacles[0].x  && this.x < obstacles[0].x+obstacles[0].width ){
                return true 
            }
        }
    }
    is_up_hit(index){
        if(this.y < obstacles[0].up_height){
            return true
        }
    }
    is_down_hit(index){
        if(this.y+(this.height) > obstacles[0].down_y){
            return true
        }
    }
    //Affichage
    show (){
        if (this.wasBest == false) {
            noStroke()
            if (this.is_ia) {
                if (this.is_alive == false) {
                    stroke('rgb(255, 102, 102)')
                    fill(180, 180, 0)
                }else{
                    fill(255, 255, 51)
                }
            }else{
                if (this.is_alive == false) {
                    stroke('rgb(255, 102, 102)')
                    fill(150, 150, 150)
                }else{
                    fill(255, 255, 255)
                }
            }
            rect(this.x, this.y, this.width, this.height, this.radius)
        }else {
            stroke('black')
            fill(200, 50, 50)
            rect(this.x, this.y, this.width, this.height, this.radius)
            noStroke()
        }
    }
    //Mort
    kill_player(){
        this.score = level.time
        this.x = 0
        level.player_alive -= 1;
        this.is_alive = false
        
    }

}

class obtacle {
    constructor (hole_size) {
        var temp_hole_size =hole_size;
        var temp_center = random(100, level.height-50);
        this.vitesse = level.speed;
        this.width = 90,
        this.x = level.width+this.width;

        this.up_y = 0;
        this.up_height = temp_center-temp_hole_size,
        
        this.down_y =  temp_center+temp_hole_size,
        this.down_height =  level.height-(this.up_height+temp_hole_size);    
    }
    move (){
        this.x -= this.vitesse ;    
    }
    show (){
        noStroke()
        fill(30,235,30)
        rect(this.x+5, this.up_y, this.width+5, this.up_height+5)
        rect(this.x+this.width, this.down_y+5, 10, this.down_height+5)

        fill(50, 255, 50)
        rect(this.x, this.up_y, this.width, this.up_height)
        rect(this.x, this.down_y, this.width, this.down_height)
        
    }
    
}

class level {
    constructor (){
        this.game_ON = true
        this.height = 500,
        this.width = 1600,
        this.background_color_r = 174,
        this.background_color_g = 210, 
        this.background_color_b = 241,
        this.space_between_obstacle = base_space_bewteen,
        this.speed = 10,
        this.time = 0,
        this.player_alive = 0,
        this.nbr_joueur_au_sol = 0,
        this.hole_size = base_hole_size
        
    }
    reset (){
        this.game_ON = true
        this.height = 500,
        this.width = 1600,
        this.speed = 10,
        this.background_color_r = 174,
        this.background_color_g = 210, 
        this.background_color_b = 241,
        this.space_between_obstacle = base_space_bewteen,
        this.time = 0,
        this.nbr_joueur_au_sol = 0,
        this.hole_size = base_hole_size,
        obstacles.push(new obtacle(this.hole_size)),
        this.player_alive = players.length
    }
    update() {
        if (this.player_alive > 0 && this.nbr_joueur_au_sol < players.length) {
            this.time ++
            
            
            //Gestion  des valeurs du Player
            for (let index = 0; index < players.length; index++){
                players[index].update()            
                players[index].show()
            }
            //Gestion des valeurs des obstacles
            //on créer un nouvelle obstacle toute les 120 frame = 2sec (60fps)
            if (this.time % int(this.space_between_obstacle) == 0) {
                obstacles.push(new obtacle(int(this.hole_size)))
                if (this.space_between_obstacle > 100){
                    this.space_between_obstacle -= 2
                }else if (this.space_between_obstacle >90) {
                    this.space_between_obstacle -= 1
                }
                if (this.time > 500 && this.hole_size >35) {
                    this.hole_size -= 0.2
                }
            }
            
            //On test si les obstacle atteigne la fin et on les retire
            if (obstacles[0].x == -obstacles[0].width) {
                obstacles.splice(0,1)
            }
            //Pour chaque obstacle on effectue les actions
            for (let index = 0; index < obstacles.length; index++) {
                obstacles[index].move()
                obstacles[index].show()
            }
            this.affichage_score()
        }else{
            //this.game_over()
        }
        for (let index = 0; index < players.length; index++){
            if (players[index].is_alive == false) {
                saved_players.push(players.splice(index, 1)[0]);
            }
        }
        if (players.length === 0) {
            //counter = 0;
            var res = Math.max.apply(Math, saved_players.map(function(player) { return player.score; }))
            best_score_storage.push([counter, res])
            nextGeneration();
            counter +=1;
            obstacles = [];

        }

    }
    affichage_score(){
        //Le conteur de parties
            fill(100, 100, 100)
            textSize(60);
            textAlign(CENTER, CENTER);
            text(counter, (this.width/2), (this.height/6)-20);
        //Le compteur de joueur encore en vie
            fill(100, 100, 100)
            textSize(20);
            textAlign(LEFT, CENTER);
            text("Nombre de joueur :"+ this.player_alive, this.width-250, 30);
        //Affichage score max
            fill(220, 220, 220)
            textSize(20);
            textAlign(LEFT, CENTER);
            text("Score :"+ this.time, this.width-250, this.height-40);
    }
    create_player(nbr){
        var nbr_players_before_this = players.length
        for (let index = 0; index < nbr; index++) {
            players.push(new player(true))
            players[index+nbr_players_before_this].y = int(random(0,level.height))
            this.player_alive +=1
        }
    }
    
    game_over(){
        if (this.game_ON == true){
            for (let index = 0; index < players.length; index++){
                print('Player '+index+' : '+players[index].score)
            }
            this.game_ON = 120
        }else if(this.game_ON >2){
            this.game_ON -= 1;
            this.background_color_r = 255
            this.background_color_g = 51
            this.background_color_b = 51
            background ( this.background_color_r, this.background_color_g, this.background_color_b)
            for (let index = 0; index < players.length; index++) {
                if (players[index].y < this.height-10){
                    players[index].update()                
                }
                players[index].show()
            }
            for (let index = 0; index < obstacles.length; index++) {
                obstacles[index].show()
            }
            fill(51, 204, 255)
            textSize(60);
            textAlign(CENTER, CENTER);
            text('GAME OVER', (this.width/2), (this.height/2));
            textSize(50);
            text('best score '+this.time, (this.width/2), (this.height/2)+100);
            
        }else if(this.game_ON < 2){
            
            frameRate(0)
        }
        
    }
}

function draw_background(start = false){
    //Dessine le fond
    background ( level.background_color_r, level.background_color_g, level.background_color_b)
    //Le sol en arriere plan
    fill(153, 102, 51)
    noStroke()
    rect(0, level.height-80, level.width, 80)
    //Le ciel en arriere plan
    fill(225, 225, 250)
    rect(0, 0, level.width, 80)
    //On precise qu'il faut cliquer sur start + Info accueil
    if(start){
        stroke('#b8e994')
        strokeWeight(4)
        fill('#f8c291')
        rect((level.width/2)-120, ((level.height/3)*2)-60, 240, 110)
        noStroke()
        fill('#eb2f06')
        textAlign(CENTER, CENTER);
        textSize(60);
        text('Flappy Evolution', (level.width/2), (level.height/3));
        textSize(30);
        text('par Jérôme Riffier', (level.width/2)+120, (level.height/2)-25);
        
        fill('#6ab04c')
        textSize(60);
        text('START', (level.width/2), (level.height/3)*2);
        
    }
}

//Function for evolution
function nextGeneration() {
    actualBestPlayer = get_last_best();
    actualise_stat (counter, level.time, calculateAverageScore());
    calculateFitness();
    for (let i = 0; i < total_cobaye-1; i++) {
        //players[i] = pickOne();
      players[i] = childBest();    
    }
    players.push(actualBestPlayer)
    for (let i = 0; i < total_cobaye; i++) {
      saved_players[i].dispose();
    }
    saved_players = [];
}

function childBest() {
    //trouver le meilleur, le cloner ET muter ses clone 
    var res = Math.max.apply(Math, saved_players.map(function(player) { return player.score; }))
    var player_temp = saved_players.find(function(player){ return player.score == res; })
    let child = new player(true, player_temp.brain);
    child.mutate();
    return child;
}

function get_last_best() {
    //trouver le meilleur et le cloner SANS le muter
    var res = Math.max.apply(Math, saved_players.map(function(player) { return player.score; }))
    var player_temp = saved_players.find(function(player){ return player.score == res; })
    let child = new player(true, player_temp.brain);
    child.wasBest = true
    
    return child;
}

function calculateFitness() {
    let sum = 0;
    for (let player of saved_players) {
        sum += player.score;
    }
    for (let player of saved_players) {
        player.fitness = player.score / sum;
    }
}

function calculateAverageScore(){
    var total_score = 0;
    for (let i = 0; i < saved_players.length; i++) {
        total_score += saved_players[i].score  
    }
    return total_score/ saved_players.length
}

function battleHumanIa(difficulty = '1') {
    total_cobaye = 1;
    //difficulty == '0' => FACILE             difficulty == '1'=> Medium          difficulty == '2' => hard
     if (difficulty == '0') {
         base_space_bewteen = 160;
        base_hole_size = 130;
    }else if (difficulty == '2') {
        base_space_bewteen = 100;
        base_hole_size = 60;
    }else{
        base_space_bewteen = 120;
        base_hole_size = 100;
    }

    //On stocke le champion actuel avant de reset la table Players
    
    var temp_champion = players[players.length-1];
    best_score_storage = [];
    obstacles = [];
    players = [];   // #Birds[] toi-même tu sais^^
    saved_players = [];
    counter = 0;
    running = true
    level.reset()
    createCanvas(level.width, level.height)
    //On creer le champion
    players.push(new player(true, temp_champion.brain))
    players[0].wasBest = true
    players[0].y = int(random(0,level.height))
    //On creer le challenger humain
    players.push(new player(false))
    players[1].y = int(random(0,level.height))
    level.player_alive =2

}

function full_reset(nbr_total = 150, difficulty = '1'){
    total_cobaye = nbr_total;
    //difficulty == '0' => FACILE             difficulty == '1'=> Medium          difficulty == '2' => hard
    if (difficulty == '0') {
        base_space_bewteen = 160;
        base_hole_size = 130;
    }else if (difficulty == '2') {
        base_space_bewteen = 100;
        base_hole_size = 60;
    }else{
        base_space_bewteen = 120;
        base_hole_size = 100;
    }

    best_score_storage = [];
    obstacles = [];
    players = [];   // #Birds[] toi-même tu sais^^
    saved_players = [];
    counter = 0;
    running = false
    level.reset()
    createCanvas(level.width, level.height)
    level.create_player(total_cobaye)
    draw_background(true)

}

function mouseClicked(){
    if(!$('.modal').hasClass('off')){ return }
    if (mouseX > 0 && mouseX < level.width  && mouseY  > 0 && mouseY < level.height) {
        running = !running
    }
}

