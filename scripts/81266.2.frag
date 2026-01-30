#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

// 2D Random, stolen from Patricio Gonzales https://thebookofshaders.com/11/
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

vec2 mapVec2(vec2 vector, float a1, float b1, float a2, float b2){
	float scale = (b2 - a2) / (b1 - a1);
	return (vector - a1 ) * scale + a2;
}

// 2D Noise based on Morgan McGuire @morgan3d (written by Patricio Gonzales)
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


void main( void ) {

	//in px
    float gridSize = 30.;
    //in percent
    float gridLine = .1;
    //in percent
    float pointRadius = .2;
   
    vec2 gridPos = gl_FragCoord.xy / gridSize;
    gridPos += vec2(mouse.x, time);
    
    vec2 gridPosFrac = fract(gridPos);
    vec2 gridPosFloor = floor(gridPos);

    vec3 col = vec3(0., 0., 0.);
    
    //random point
    vec2 randomPoint = random2(gridPosFloor);
    
    float inverseRadius = 1. - pointRadius;
    //map to acceptable range
    randomPoint = mapVec2(randomPoint, 0., 1., min(inverseRadius, pointRadius), max(inverseRadius, pointRadius));
    
    //grid
//col.r += step(1. - gridLine, gridPosFrac.x) + step(1. - gridLine, gridPosFrac.y);
    
    //points
    col.b += step(inverseRadius, 1. - distance(gridPosFrac, randomPoint));
    
    // Output to screen
    gl_FragColor = vec4(col,1.0);
    

}