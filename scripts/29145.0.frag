#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

void main( void ) {
	vec3 light_color = vec3(1.2, 0.8, 0.6);
	
	float t = time;
	
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy *.5 ) / resolution.x;
	
	float angle = atan(position.y, position.x)/(2. * PI);
	angle -= floor(angle);
	
	float rad = length(position);
	float color = 0.0;
	float brightness = 0.015;
	float speed = .3;
	
	float adist = .2/rad;
	float dist  = (t*1.5 + adist);
	dist = abs(fract(dist)-.5);
	color = (1.0/(dist)) * brightness;
	
	gl_FragColor =  vec4(color,color,color,1.0)*vec4(light_color,1.0);
}