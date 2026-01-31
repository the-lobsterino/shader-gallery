#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - mouse;
		
	float r=0.01, g=0.02, b=0.03;
	float x=p.x, y=p.y;
	
	r += pow(1./x*y, 1.0000001)*0.25;
	r += 0.25/pow(1./x*y, 1.0000001);
	g += 1.-pow(x*y, 1.01)*100.0;
	g += 1.-pow(-x*y, 1.)*70.0;
	b += -pow(x*y*700., 1.)*0.05;
	b += pow(x*y*700., -1.)*0.05;
	
	gl_FragColor = vec4(r, g, b, 1.0 );

}