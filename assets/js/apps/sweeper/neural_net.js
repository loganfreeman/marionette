var Neuron = new Class({
    num_inputs: undefined,
    input_weights: [],
    
    initialize: function(num_inputs){
        this.num_inputs = num_inputs;
        
        // we need an additional weight for the bias hence the +1
        for (var i=0; i<this.num_inputs+1; i++){
            // set up the weights with an initial random value
            this.input_weights.push( Math.random() );
        }
    }
});



var NeuronLayer = new Class({
    num_neurons: undefined,
    neurons: [],
    
    initialize: function(num_neurons, num_inputs_per_neuron){
        this.num_neurons = num_neurons;
        
        for (var i=0; i<num_neurons; i++){
            var neuron = new Neuron( num_inputs_per_neuron );
            this.neurons.push( neuron );
        }
    }
});



var NeuralNet = new Class({
    settings: {
        inputs: 2,
        outputs: 2,
        layers: 1,
        neurons: 5,
    },
    
    layers: [],

    initialize: function(settings){
        if (settings != undefined) {
            settings = new Hash(settings);
            this.settings = settings.combine(this.settings);
        }
        
        for (var i=0; i<this.settings.layers; i++){
            var layer = new NeuronLayer( this.settings.neurons,
                                         this.settings.inputs );
            
            this.layers.push( layer );
        }
    },


    // gets the weights from the NN
    getWeights: function(){

    },


    // returns the total number of weights in the net
    getNumberOfWeights: function(){

    },


    // replaces the weights with new ones
    putWeights: function(weights){

    },


    // calculates the outputs from a set of inputs
    update: function(inputs){
       // stores the outputs from each layer
       var outputs = [];
       var weight = 0;

       // check that we have the correct number of inputs
       if (inputs.length != this.settings.inputs) {
           // return an empty array if incorrect
           return outputs;
       }

       // for each layer..
       for (var i=0; i<this.settings.layers; i++){
           if (i > 0){
               inputs = outputs;
           }
   
           outputs = [];
           weight = 0;
   
           // for each neuron sum the (inputs * corresponding weights). Throw
           // the total at our sigmoid function to get the output.
           for (var j=0; j<this.layers[i].num_neurons; j++){
               var netinput = 0;
               var num_inputs = this.layers[i].neurons[j].num_inputs;
       
               // for each weight
               for (var k=0; k<num_inputs-1; k++){
                    
               }
           }
       }
    },


    // sigmoid response curve
    sigmoid: function(activation, response){

    }
});