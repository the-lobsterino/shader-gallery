#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi 3.14159265359
#define tau 6.28318530718


float osc(float freq, float phase){
	return 0.5 + 0.5*cos(tau*freq*time - phase); 	
}

vec2 cplxmult(vec2 a, vec2 b){
 	return vec2(a.x * b.x - a.y * b.y, a.x*b.y+a.y*b.x);
}

float sigmoid(float x){
	return 2.0/(1.0 + exp2(-x)) - 1.0;
}

vec2 p(vec2 a, float s){
	return floor(s*a)/s;
}

void main( void ) {
	vec2 pos2 = gl_FragCoord.xy / resolution.xy;
	vec2 pos = p(pos2 , 10.0/length(mouse-pos2));
	vec3 color;

	vec3 c1 = vec3(step(0.7,osc(0.7,11.0*pos.x)),pos.y,0.0);
	vec3 c2 = vec3(0.0,pos.x,osc(0.5,20.0*dot(pos,vec2(osc(0.5,0.0),osc(0.5,0.5*pi)))));
	float o = osc(0.3,30.0*dot(pos,mouse-vec2(0.5,0.5)));
	color = mix(c1,c2,o);
	gl_FragColor = vec4( color, 1.0 );
}