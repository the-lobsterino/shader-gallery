//Creator: Michael 

//import for processing

//choose the precision map
precision mediump float;

//determine the global variables
uniform vec2 u_resolution;
uniform float u_time;

//colour palette creation :D
//use the website to get the colour values because I'm so bad
vec3 palette (float t) {

    //vector of colours
    vec3 a = vec3(0.9922, 0.3961, 0.9412);
    vec3 b = vec3(0.5373, 0.6588, 0.8078);
    vec3 c = vec3(0.6039, 1.0, 0.5608);
    vec3 d = vec3(1.897, 1.118, 1.328);
    
    //note: 6.28318... is 2*pi 
    return a + b*cos(6.28318*(c*t+d));
}

void main(void){
//determine the FragCoord and reolution settings for the UV of the canvas
    vec2 uv =(gl_FragCoord.xy/u_resolution.xy) * 2.0 - 1.0;

//setting the global canvas midpoint instead of for each section
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

//create the for loop to repeat instructions
//adding iterations
    for (float i = 0.0; i<3.0; i++) {
        
        //split into multiple sections
        uv = fract(uv * 1.5)-0.5;
        
        //making sure no stretching occurs when the canvas' dimensions are altered
        uv.x *= u_resolution.x / u_resolution.y;

        //multiply d by the exponential of distance from the centre of the canvas
        float d = abs(length(uv) * exp(-length(uv0)));
        
        //changing coloured based on distance over time from centre and using colour palette
        vec3 color =  palette(length(uv0) + i*0.4 + u_time*0.4);
        
        //decreasing circle sizes
        d = sin(d*8.0 + u_time)/8.0;
        
        //hollowing out circle any negative values become positive
        d = abs(d);

        //introducing power (pow) function to increase contrast of image
        d = pow(0.01/d, 1.2);
        
        //using final colour instead local colour of respective sections 
        finalColor += abs(color*sin((d*2.0)));
    }

//Main - colour rendering - what exists on the canvas
    gl_FragColor = vec4(vec3(finalColor), 1.0);
    
}