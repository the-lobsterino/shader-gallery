#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define t time
#define r resolution
void main( void ) {
	vec3 c;
	float l, z=t;
	vec2 uv,p=gl_FragCoord.xy/r;
	uv=p;
	p-=.5;
	p.x*=r.x/r.y;
	z+=.07;
	l=length(p);
	//uv+=p/l;
	gl_FragColor=vec4(vec2( .01/length(abs(mod( (sin(t)+1.5)*abs(sin(l*20.+t)), 1.) ) - .5)), 0.0, t);
}