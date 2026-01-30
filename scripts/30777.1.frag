#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec4 BLUE = vec4( 0.0, 0.5, 1.0, 1.0 );
const vec4 BLUET = vec4( 0.0, 0.75, 1.0, 1.0 );
const vec4 TEAL = vec4( 0.0, 1.0, 1.0, 1.0);
const vec4 TEALG = vec4( 0.0, 1.0, 0.5, 1.0);
const vec4 GREEN = vec4( 0.0, 1.0, 0.0, 1.0 );
const vec4 GREENY = vec4( 0.5, 1.0, 0.0, 1.0 );
const vec4 YELLOW = vec4( 1.0, 1.0, 0.0, 1.0);
const vec4 YELLOWR = vec4( 1.0, 0.5, 0.0, 1.0);
const vec4 RED = vec4( 1.0, 0.0, 0.0, 1.0 );
const vec4 REDP = vec4( 1.0, 0.0, 0.5, 1.0 );
const vec4 PURPLE = vec4( 1.0, 0.0, 1.0, 1.0 );
float remap(float minval, float maxval, float curval){
	return (curval - minval)/(maxval - minval);
}

void main( void ) {
	const int num = 10;
	vec3 controlPoints[num];
	controlPoints[0] = vec3(mouse,0.5);
	for(int i = 1; i < num; i++){
		float j = float(i);
		controlPoints[i] = vec3((j)*0.1,0.5-sin((time*j)*0.1)*0.5,1.0);
	}

	vec2 p = gl_FragCoord.xy / resolution.xy;
	float swell = 0.0;
	float dist = 0.0;
	float scale = 51.0/float(num);
	for(int i = 0; i < num; i++){
		dist = distance(controlPoints[i].xy,p)*scale+controlPoints[i].z;
		if(dist > 0.0){
			swell += controlPoints[i].z/dist;
		}
	}
	swell = swell / float(num);
	
	gl_FragColor = vec4(1.0,1.0,1.0,1.0);
  	
	float dCol = swell;
	if(dCol < 0.3){
		gl_FragColor = BLUE;
	} else if(dCol < 0.31){
		gl_FragColor = BLUET;
	} else if(dCol < 0.32){
		gl_FragColor = TEAL;
	} else if(dCol < 0.33){
		gl_FragColor = TEALG;
	} else if(dCol < 0.34){
		gl_FragColor = GREEN;
	} else if(dCol < 0.35){
		gl_FragColor = GREENY;
	} else if(dCol < 0.36){
		gl_FragColor = YELLOW;
	} else if(dCol < 0.37){
		gl_FragColor = YELLOWR;
	} else if(dCol < 0.38){
		gl_FragColor = RED;
	} else if(dCol < 0.39){
		gl_FragColor = REDP;
	} else {
		gl_FragColor = PURPLE;

	}
  	if (mod(swell*1000.0, 5.0) <= 0.2 && mod(swell*1000.0, 10.0) >= 0.2) {
		gl_FragColor = vec4(1.0,1.0,1.0,1.0); 
	}
}