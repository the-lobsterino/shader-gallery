// DICKBA


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define PI 3.14159265359

vec3 color = 0.9*vec3(1,2,1);
float d2y(float d){return 1./(0.2+d);}
float radius = 0.42;

float fct(vec2 p, float r){
	float a = 9.*mod(-atan(p.y, p.x)-time, 0.1*PI);
	
	
	float scan = 0.*1.;
	return (d2y(a)+scan)*(1.-step(radius,r));
}

	
float circle(vec2 p, float r){
	float d=distance(r, radius);
	return d2y(250.*d);
}

float grid(vec2 p, float y){
	float a = 0.1;
	float res = 3.;
	float e = 0.9;
	vec2 pi = fract(p*res);
	pi = step(e, pi);
	return a * y * pi.x * pi.y;
}

void main( void ) {
	
	vec2 position = (( gl_FragCoord.xy )-0.5*resolution)/ resolution.y ;
	position/=cos(1.125*length(position));
	float y  = 0.;
	
	float dc = length(position);
	
	y+=fct(position, dc);
	y+=circle(position, dc);
	y+=grid(position, y);
	y=pow(y,1.75);
	gl_FragColor = vec4( sqrt(y)*color,1.0 );
}