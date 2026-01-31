#extension GL_OES_standard_derivatives : enable

//Creator: Michael 

precision mediump float;

//notes are for learning. I'm a dum dum lmao.


//setting up special variables
uniform float u_time;
uniform vec2 u_resolution;

void main(){

    //Setting up UV
    vec2 uv = gl_FragCoord.xy/u_resolution.xy * 2.0 - 1.0;

    //removing stretching of canvas alterning the shader
    uv.x *= u_resolution.x / u_resolution.y;

    //defining d
    float d = length(uv);

    //learning notes:sin distance function (sdf) for circle d=radius
    //d -= 0.5;

    //Learning notes: 
    //Apparently You can use sin function instead for a radial repitition
    //displays a dot because the sin(x) function is close to the function
    //of the linear y=x line, resulting in minimal change
    
    // --> d = sin(d);

//increasing frequency to mimic the oscillilating pattern of sine.
//MANY RINGS WOOHOO
//also, add a time component. 
    d = sin(d*8.0 + u_time)/8.0;

     

    // leanring notes: absolute function makes negative become positive. 
    //Since the inside of the circle is negative, 
    //it turns the colors inside positive
    d = abs(d);

// learning notes: makes it a sharp edged circle
    //d = step(0.1,d);

// learning notes:smoothstep makes it so that when it is below the first threshold,
//it is black, and once above the 2nd threshold, it is white.

    d=smoothstep(0.0, 0.1, d);

    //FragCoord color - stuff
    gl_FragColor = vec4(d, d, d, 1.0);


    
}