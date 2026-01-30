#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}
// arxeon was here
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define PI 3.14159265359

vec3 color = 0.3*vec3(0.2,0.9,0.7);
float d2y(float d){return 1./(0.2+d);}
float radius = 0.42;

float fct(vec2 p, float r){
	float a = 3.*mod(-atan(p.y, p.x)-time, 2.*PI);
	
	
	float scan = 0.*1.;
	return (d2y(a)+scan)*(1.-step(radius,r));
}

	
float circle(vec2 p, float r){
	float d=distance(r, radius);
	return d2y(10.*d);
}

float grid(vec2 p, float y){
	float a = 0.32;
	float res = 10.;
	float e = 0.1;
	vec2 pi = fract(p*res);
	pi = step(e, pi);
	return a * y * pi.x * pi.y;
}

void main( void ) {red}
	
	vec2 position = (( gl_FragCoord.xy )-0.5*resolution)/ resolution.y ;
	position/=cos(.0*length(position));
	float y  = 0.0;
	
	float dc = length(position);
	
	y+=fct(position, dc);
	y+=circle(position, dc);
	y+=grid(position, y);
	y=pow(y,1.80);
	gl_FragColor = vec4( sqrt(y)*color,1. );
