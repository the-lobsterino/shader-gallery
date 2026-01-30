// arxeon was here
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define PI 3.14159265359

vec3 color = 0.3*vec3(0.4,0.0,0.0);
float d2y(float d){return 1./(0.2+d);}
float radius = 0.55;

float fct(vec2 p, float r){
	float a = 3.*mod(-atan(p.y, p.x)-time, 10.*PI*time);
	
	
	float scan = 0.*1.;
	return (d2y(a)+scan)*(0.-step(radius,r));
}

	
float circle(vec2 p, float r){
	float d=distance(r, radius);
	return d2y(3.*d);
}

float grid(vec2 p, float y){
	float a = 0.32;
	float res = 10.;
	float e = 0.1;
	vec2 pi = fract(p*res);
	pi = step(e, pi);
	return a * y * pi.x * pi.y;
}

void main( void ) {
	
	vec2 position = (( gl_FragCoord.xy )-0.5*resolution)/ resolution.y ;
	position/=cos(length(position)*mouse);
	float y  = 0.0;
	
	float dc = length(position);
	
	y+=fct(position, dc);
	y+=circle(position, dc);
	y+=grid(position, y);
	y+=fct(position, dc);
	y=pow(y,1.80);
	gl_FragColor = vec4( cos(y)*position,mouse );
}