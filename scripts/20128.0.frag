#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define PI 3.14159

vec2 toPolar(vec2 p) {
	float a = atan(p.y/p.x);
	if (p.x < 0.0) a += PI;
	float r = sqrt(p.x*p.x + p.y*p.y);
	return vec2(a/(2.0*PI), r);
} 

void main( void ) {

	vec2 p = surfacePosition*10.0;
	vec2 o = toPolar(p);
	
	vec3 color = vec3(0.0);
	vec2 s = vec2(0);
	vec2 v = vec2(p);

	for (int i=0; i<3; i++) {
		v = -abs(v)/(dot(v,v)-abs(p))-abs(p);
		s += v;
		p = abs(p)/dot(p,p);
	}
	
	s = toPolar(s)*0.11;
	
	color = vec3(s*1.0,0);
	
	gl_FragColor = vec4( color, 1.0 );

}