#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void ) {

	float color = 0.0;
	float pixelOffsetX = gl_FragCoord.x*100.0; //No movement in X
	vec2 center = resolution.xy / 2.0;
	float radius = distance(gl_FragCoord.xy, center);
	
	pixelOffsetX = gl_FragCoord.x - time*50.0; //Movement in X
	
	color += sin( time * 0.5 ); //Rate of change
	color += sin(0.04 *pixelOffsetX); //Size in X of shapes
	color += sin(0.04 *gl_FragCoord.y); //Size in Y of shapes

	gl_FragColor = vec4( sin(color*9.0), sin(color * 12.0), sin (color), 1.0 ); //Apply changes

}