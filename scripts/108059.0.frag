#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = gl_FragCoord.xy/resolution;
	p -= 0.5;
	p *= 20.;
	
	p += vec2(sin(p.x+time*2.), cos(p.y+time*2.))*.2;
	vec2 q = vec2(atan(p.x, -p.y)*10., length(p));
	p = mix(p,q,clamp(sin(time*.2)*2.+1., 0., 1.));
	//p = q;
	p += time*3.;
	p = mod(p, 2.);
	p = floor(p);
	
	float a = p.x+p.y == 1. ? 1. : 75.;
	

	gl_FragColor = vec4(a);

}