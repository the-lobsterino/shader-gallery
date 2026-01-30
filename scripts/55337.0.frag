#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define FLAT  0
#define MOUSE 1
#define PI 3.14159265359

vec3 color = 0.3*vec3(0.2,0.9,0.7);
float d2y(float d){return 1./(0.2+d);}
float radius = 0.42; 

float fct(vec2 p, float r){
	float a = 3.*mod(-atan(p.y, p.x)+time, 2.*PI);
	
	
	float scan = 0.*1.;
	return (d2y(a)+scan)*(1.-step(radius,r));
}

	
float circle(vec2 p, float r){
	float d=distance(r, radius);
	return d2y(100.*d);
}

float grid(vec2 p, float y){
	float a = 0.2;
	float res = 30.;
	float e = 0.1;
	vec2 pi = fract(p*res);
	pi = step(e, pi);
	return a * y * pi.x * pi.y;
}

void main( void ) {
	
	vec2 position = (( gl_FragCoord.xy )-0.5*resolution)/ resolution.y ;
	position/=cos(1.5*length(position));
	float y  = 0.;
	
	float dc = length(position);
	
	y+=fct(position, dc);
	y+=circle(position, dc);
#if ! FLAT
	y+=grid(position, y);
#else
	y=1.-y;
	y=clamp(y,0.,1.);
	y=pow(y, 0.01);
	y=1.-y;
#endif
	y=pow(y,1.5);
	gl_FragColor = vec4( sqrt(y)*color,1.0 );
}