#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) -0.225;

	 
	float c = mod(10.5*length(p*10.)*sin(time)*10.0+abs(tan(p.x*p.y*200.0)),0.9)+0.1*cos(time)-0.3;
	 

	gl_FragColor = vec4(vec3(c,-c,c*c), 2.7 );

}