	
precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(){
    vec2 st = gl_FragCoord.xy/resolution;
    float pct = 0.5;

    // a. The DISTANCE from the pixel to the center
    // pct = distance(st,vec2(0.5));
    pct = distance(st,mouse);

    // b. The LENGTH of the vector
    //    from the pixel to the center
    // vec2 toCenter = vec2(0.5)-st;
    // pct = length(toCenter);

    // c. The SQUARE ROOT of the vector
    //    from the pixel to the center
    // vec2 tC = vec2(0.5)-st;
    // pct = sqrt(tC.x*tC.x+tC.y*tC.y);

    vec3 color = vec3(pct);
    gl_FragColor = vec4( color, 1.0 );
}