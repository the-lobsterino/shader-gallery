#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p-=.5;
	p.x*=resolution.x/resolution.y;
	p*=2.;
	p*=10.;
	p=mod(p,1.);
	p*=2.;
	p-=1.;

	float c=p.x*p.x+p.y*p.y;
	float k=0.5;
	float e=0.1;
	float c1=smoothstep(1.-e-k,1.-k,c);
	float c2=smoothstep(1.-e,1.,c);
	
	c=c1-c2;
	
	gl_FragColor = vec4( vec3(c), 1.0 );

	
}