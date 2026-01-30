#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	position.y = 1.0 - position.y;
	
	vec2 center = vec2(0.5,0.5); 
	
	float luma = 1.0 - length(position -center);
	luma = pow(luma, 20.0);
	
	gl_FragColor = vec4( luma);
	
}