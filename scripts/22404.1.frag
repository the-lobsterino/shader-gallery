#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition*192.0;
	float radius = 0.7;
	vec2 q = p;

	p = 1.0/(p*vec2(1.0/log(1.0-p.y),1.0)*step(p.y, log(1.0-p.y)) - vec2(0))/radius/radius;
	vec2 f = 10.0*mod(p-time*0.1, vec2(0.1));
	gl_FragColor = vec4( floor(0.5+10.0*mod(p+0.025, vec2(0.1))).x*vec4(pow(0.3,abs(p.x)), 1.0, 0.45, 1.0) + f.y*vec4(1.0,2.0,1.0,1.0)-vec4(0.2, 1.0, 0.4, 1.0)/max(abs(p.x*p.x),1.0) )*clamp(-1.0/p.y/16.0, 0.0, 1.0);
}