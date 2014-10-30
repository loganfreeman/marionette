var Sweepers = {
    settings: {
        container: 'sweepers-container',
        
        sweepers: 5,
        sweepers_color: 'red',
        sweepers_radius: 3,
        
        food: 20,
        food_color: 'green',
        food_radius: 1,
        
        path_color: '#ccc',
        
        canvas_height: 200,
        canvas_width: 320,
        
        fps: 20,
    },
    
    food: [],
    sweepers: [],
    
    timeout: undefined,
    
    
    init: function(settings){
        if (settings != undefined) {
            // merge our specified settings with our defaults
            settings = new Hash(settings);
            this.settings = settings.combine(this.settings);                    
        }
        
        // create the Raphael canvas
        this.paper = Raphael(   this.settings.container,
                                this.settings.canvas_width,
                                this.settings.canvas_height );
        
        // add the food and sweepers to the canvas
        this.createFood();
        this.createSweepers();
        
        // and run the main loop
        this.timeout = setTimeout("Sweepers.main()", 1000 / this.settings.fps);
    },
    
    
    main: function(){
        for (var i in this.sweepers) {
            if (this.sweepers[i].sprite != undefined) {
                // find the nearest piece of food
                this.sweepers[i].target = this.findFood(this.sweepers[i].coord);
                
                // through the target into the neural net
                var results = this.sweepers[i].brain.update(this.sweepers[i].target);
                
                this.sweepers[i].coord[0] = this.sweepers[i].coord[0] + 0.5;
                this.sweepers[i].coord[1] = this.sweepers[i].coord[1] + 0.5;
                this.sweepers[i].sprite.translate(0.5, 0.5);
                
                // draw the path to target
                if (this.sweepers[i].path != undefined) {
                    this.sweepers[i].path.remove();
                }
                
                this.sweepers[i].path = this.paper.path('M'+this.sweepers[i].coord[0]+' '+this.sweepers[i].coord[1]+'L'+this.sweepers[i].target[0]+' '+this.sweepers[i].target[1]);
                this.sweepers[i].path.attr({
                    "stroke": this.settings.path_color
                });
                this.sweepers[i].path.toBack();
                
            }
        }
        
        
        // we need to continue running the main loop
    //    this.timeout = setTimeout("Sweepers.main()", 1000 / this.settings.fps);
    },
    
    
    createFood: function(){
        for (var i=0; i<this.settings.food; i++){
            // generate a random starting coordinate
            var coord = this.randomCoord();
            
            // draw the food on the canvas
            var c = this.paper.circle(coord[0], coord[1], this.settings.food_radius);
            c.attr({
                "fill": this.settings.food_color,
                "stroke": this.settings.food_color,
            });
            
            // and push this food to the food array so we can keep track of it
            this.food.push(new Hash({
                sprite: c,
                coord: coord,
            }));
        }
    },
    
    
    createSweepers: function(){
        for (var i=0; i<this.settings.sweepers; i++){
            // generate a random starting coordinate
            var coord = this.randomCoord();
            
            // draw the sweeper on the canvas
            var c = this.paper.circle(coord[0], coord[1], this.settings.sweepers_radius);
            c.attr({
                "fill": this.settings.sweepers_color,
                "stroke": this.settings.sweepers_color,
            });
            
            // and push the sweeper to the sweepers array so we can keep track of it
            this.sweepers.push(new Hash({
                sprite: c,
                coord: coord,
                brain: new NeuralNet(),
                target: this.findFood(coord),
                dir: (Math.random() * 2) -1,
            }));
        }
    },
    
    
    findFood: function(coord){
        // set the initial closest distance to the maximum possible
        var max_x = this.settings.canvas_width;
        var max_y = this.settings.canvas_height;
        var min_dist = Math.sqrt( max_x*max_x + max_y*max_y );
        var target = [0,0];
        
        // for each piece of food...
        for (var i=0; i<this.settings.food; i++){
            // calculate the distance from it to the sweeper
            var x = this.food[i].coord[0] - coord[0];
            var y = this.food[i].coord[1] - coord[1];
            
            var dist = Math.sqrt( x*x +y*y );
            
            if (dist < min_dist) {
                min_dist = dist;
                target = [this.food[i].coord[0], this.food[i].coord[1]];
            }
            
        }
        
        return target;
    },
    
    
    randomCoord: function(){
        var x = Math.round( Math.random() * this.settings.canvas_width );
        var y = Math.round( Math.random() * this.settings.canvas_height );
        
        return [x,y];
    },
};