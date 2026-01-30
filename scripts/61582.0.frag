#ifdef GL_ES
precision mediump float;
#endif

vec2 dim = vec2(20., 20.);
vec4 odd = vec4(0., 0., 0., 1.);
vec4 even = vec4(1., 1., 1., 1.);
vec4 mainCol = vec4(2./255., 58./255., 60./255., 1.);

float random2D(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float random(float p) {
    return fract(sin(p) * 43758.5453123);
}

vec2 getRandomPos(float randCoef, vec2 maxXY) {
    float randX = random(randCoef + 1.) * maxXY.x;
    float randY = random(randCoef + 5.) * maxXY.y;
    return floor(vec2(randX, randY));
}

float PI = 3.1415926535;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = floor(gl_FragCoord.xy / dim);
    
    float ft1 = (cos(time) + 1.) / 2.;
    float ft2 = (cos(time + PI) + 1.) / 2.;
    float randCoef = floor((time + PI) / (2. * PI));
    float randCoef2 = floor((time) / (2. * PI));
    
    float intensive = 0.0;
    float intensive2 = 0.0;
    float backIntensive = 0.4;
    vec4 starColor = mainCol;
    vec4 starColor2 = mainCol;
        
    for (int i = 0; i < 60; i++) {
        vec2 maxXY = resolution.xy / dim;
        vec2 randPos = getRandomPos(randCoef + float(i * 10), maxXY);
        vec2 randPos2 = getRandomPos(randCoef2 + float(i * 20), maxXY);
        
        if (abs(randPos.x - pos.x) < 0.01 && (randPos.y - pos.y) < 0.01) {
            intensive = ft1 * random(float(i * 30));
            starColor += intensive;
        }
        
        if ((randPos2.x - pos.x) < 0.01 && abs(randPos2.y - pos.y) < 0.01) {
            intensive2 = ft2 * random(float(i * 40));
            starColor2 += intensive2;
        }
    }
    
    backIntensive = clamp(backIntensive, 0.4, 1.0);
    intensive = clamp(intensive, 0.0, 1.0);
    intensive2 = clamp(intensive2, 0.0, 1.0);
    
	gl_FragColor = backIntensive * mainCol + intensive * starColor + intensive2 * starColor2;

}