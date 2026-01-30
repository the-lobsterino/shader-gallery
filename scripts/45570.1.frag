#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );

	p.xy-=.5;
	p.x*=resolution.x/resolution.y;
	p.xy*=2.0;
	vec3 c;

	float f = sin(length(p)*100.0);
	float a = (atan(p.x,p.y)/3.1415962+1.)/2.;
	f += sin(a*200.0+mouse.x*100.0);
	float f1 = length(p.xy);
	c.g = f - f1;

	gl_FragColor = vec4( c, 1.0 );

}