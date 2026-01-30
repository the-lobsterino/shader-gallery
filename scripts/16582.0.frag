#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define iter 6

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 rand3(vec2 v){
	return vec3(rand(v),rand(v+350.0),rand(v+1001.0));
}

void main( void ) {
	vec2 p = surfacePosition;
	
	float lp = length(p) + pow(length(p), -1.) +  + pow(length(p)-10000., -1.);
		lp *= 1. + 0.3*cos(time*0.1);
	float thp = atan(p.x,p.y) + time*0.01;
	
	p.x = lp*sin(thp);
	p.y = lp*cos(thp);
	
	float power=0.5+abs(sin(0.25*time))*4.0;
	p=vec2(p.x+p.y,p.y-p.x);
	vec3 c;
	vec2 t;
	for(int i=0;i<iter;i++){
		t=abs(2.0*fract(p)-1.0);
		c+=rand3(floor(p))*clamp(1.0-pow(pow(t.x,power)+pow(t.y,power),1.0/power),0.0,1.0);
		p*=3.0;
	}
	gl_FragColor = vec4( c,1.0);
}