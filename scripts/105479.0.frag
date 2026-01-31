#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p.x *= 1.4;
	p.x -= .175;
	p.y/=1.+sin(time)*.15;
	float tunnel = sin(p.x*2./distance(p,vec2(.5)) + time*15.)*3.;
	float hole = distance(p,vec2(.5))*10.;
	
	gl_FragColor = vec4(tunnel,sin(time),tan(time),hole);


}