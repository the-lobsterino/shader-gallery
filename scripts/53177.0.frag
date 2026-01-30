precision mediump float;
uniform float time;
uniform vec2 resolution;

#define ICE            vec3(1.0)
#define MOUNTAIN       vec3(1.0, 0.7, 0.3)
#define FOREST_TOP     vec3(0.7, 0.5, 0.4)
#define FOREST_MIDDLE  vec3(0.3, 0.5, 0.1)
#define FOREST_BOTTOM  vec3(0.2, 0.4, 0.3)
#define SAND           vec3(1.0, 1.0, 0.0)
#define WATER_SURFACE  vec3(0.1, 0.1, 0.7)
#define WATER_MIDDLE   vec3(0.0, 0.0, 0.5)
#define WATER_DEEP     vec3(0.0, 0.0, 0.0)

#define ITERATION 20.0
#define ZOOM 5.0
#define SPEED 1.0

#define WATER_WORLD (0.1)

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	float res = mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

void main( void ) {
	vec2 a = resolution.xy / min(resolution.x, resolution.y);
	vec2 p = (gl_FragCoord.xy / resolution.xy)*a;

	float v = 0.0;
	
	for(float i = ITERATION; i > 0.0;i-= 1.0) {
		v += noise(p * i * ZOOM + 5. * i + vec2(time * i * SPEED, 0));
	}
	
	v /= ITERATION / 2.0;
	v += WATER_WORLD;
	
	vec3 color;
	if(v < 0.2)        color = ICE;
	else if (v < 0.30) color =  mix(ICE, MOUNTAIN,  ((v - 0.2) / 0.1) * 1.2);
	else if (v < 0.50) color =  mix(MOUNTAIN,  FOREST_TOP,  ((v - 0.3) / 0.2));
	else if (v < 0.60) color =  mix(FOREST_TOP,  FOREST_MIDDLE,  ((v - 0.5) / 0.2));
	else if (v < 0.67) color =  FOREST_MIDDLE;
	else if (v < 0.75) color =  FOREST_BOTTOM;
	else if (v < 0.80) color =  mix(SAND,  WATER_SURFACE,  ((v - 0.74) / 0.1) * 1.2);
	else if (v < 1.0)  color =  mix(WATER_SURFACE,  WATER_MIDDLE,  ((v - 0.8) / 0.2));
	else               color =  WATER_DEEP;
	
	gl_FragColor = vec4( color, 1.0 );
}
	