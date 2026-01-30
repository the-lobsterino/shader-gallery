#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p.y -= time*.1;
	float grid = mod(p.x,.1)+mod(p.y,.1)+.5;
	p.y -= time;
	float red = tan(mod(p.x*50.,sin(p.y*2.)));

	gl_FragColor = vec4(vec3(red,-.1,-.1)+vec3(grid), 1.0 );

}