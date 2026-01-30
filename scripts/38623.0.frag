#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535
#define oColor gl_FragColor


// filled circle (pos, origin, radius)
vec4 circle (vec3 p, vec3 o, float r) {
    float dist = abs(length (p-o));
    if (dist >= r) return vec4 (0);
    return vec4 (p.x, p.y, dist, 0);
}

// evaluate function
bool func(float y, float fx, float th) {
    return (abs(y - fx) <= th ? true : false);
}

void main (void) {

    vec3 posN = vec3 (gl_FragCoord.xy / resolution.xy, 1.0);
   
    float asp = resolution.x / resolution.y;  // aspect

    float sX = 2.0*PI*asp; // scale X
    float sY = 2.0*PI;     // scale Y

    mat3 mM = mat3(                             // model view 
	     sX,   0.0,      -sX/2.,            // row/col order !
	     0.0,  sY,       -sY/2.,
	     0.0,  0.0,       1.0);

    vec3 posM =  posN * mM;                     // model coords
	
    float th = (-0.00005*resolution.y) + 0.04;  // thickness function line	
 
    oColor = vec4(0,0,0,1);                     // default color

    // x/y axis
    if (func(posM.y,   0.                         , th)) oColor += vec4(1.0, 1.0, 0.0, 0.0);
    if (func(posM.x,   0.                         , th)) oColor += vec4(1.0, 1.0, 0.0, 0.0);
   
    // functions
    if (func(posM.y,   sin(posM.x)                , th)) oColor += vec4(1.0, 0.0, 0.0, 0.0);
    if (func(posM.y,   (posM.x*posM.x)-1.         , th)) oColor += vec4(0.0, 1.0, 1.0, 0.0);	
    
    float fX = 4.-(posM.x*posM.x); fX = (fX<0.0 ? 0. : fX);  // sqrt(x) undefined for x<0.
    if (func(posM.y,   sqrt(fX)                   , th)) oColor += vec4(0.0, 1.0, 0.0, 0.0);
    if (func(posM.y,  -sqrt(fX)                   , th)) oColor += vec4(0.0, 1.0, 0.0, 0.0);
    
    // rolling circle
    oColor += circle (posM, vec3 (PI*sin(time), 0.5, 1), 0.5);
    
    // or try these :-)
//    oColor += circle (posM, vec3 (posM.x, 0.5*sin(posM.x), 1), .5);
//    oColor += circle (posM, vec3 (PI*sin(posM.x*time), posM.x*posM.y, 1), .5);
//    oColor += circle (posM, vec3 (PI*sin(posM.x+time), posM.x*posM.y, 1), .5);
//    oColor += circle (posM, vec3 (PI*sin(posM.x*posM.y*time), cos(posM.x*posM.y), 1), .5);
}