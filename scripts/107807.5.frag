//Creator: Michael 

precision highp float;

uniform float time;
uniform vec2 resolution;

//colour palette creation :D
//use the website to get the colour values because I'm so bad
vec3 palette (float t) {

    vec3 a = vec3(0.9922, 0.3961, 0.9412);
    vec3 b = vec3(0.5373, 0.6588, 0.8078);
    vec3 c = vec3(0.6039, 1.0, 0.5608);
    vec3 d = vec3(1.897, 1.118, 1.328);

    return a + b*cos(6.28318*(c*t+d));

}

void main(void){

    vec2 uv = gl_FragCoord.xy/resolution.xy * 2.0 - 1.0;


    uv.x *= resolution.x / resolution.y;

    float d = length(uv);


// make the rings change through colour palette over time
    vec3 color =  palette(d + time);



    d = sin(d*8.0 + time)/8.0;

    d = abs(d);


    //d=smoothstep(0.0, 0.1, d);

//Instead of using smoothstep, 1/x, the hyperbola is a great function 
//to add neon effects
//This is completely white because the hyperbola does not touch anything
// x= 0 --> 1 or y=0-->1

    //d = 1.0/d;

//Instead, use a snaller value so that the graph reaches the UV points

    d = 0.02/d;

//mulitply color value with d
    color *= d; 

    gl_FragColor = vec4(color, 1.0);


    
}