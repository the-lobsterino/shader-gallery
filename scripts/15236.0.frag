#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (gl_FragCoord.xy / resolution.xy) + mouse;
	
	float red = 0.0; float green = 0.0; float blue = 0.0;
	red += cos(time) * cos(position.x);
	green += sin( sin(position.x) * sin(time) / 2.0 );
	blue += cos( position.y * sin(time)) * 0.5;
	
	gl_FragColor = vec4( vec3( red, green, blue ), 0.0 );
}