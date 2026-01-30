#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float rcolor = 0.0;
	float gcolor = 0.0;
	float bcolor = 150.0;
	rcolor = sin(position.x);
	gcolor = sin(position.y);
	bcolor = 1.0;
	
	gl_FragColor = vec4( vec3(rcolor, gcolor,bcolor), 1.0 );

}