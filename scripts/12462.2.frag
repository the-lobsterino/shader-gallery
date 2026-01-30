#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float colorR = sqrt((mouse.x-position.x)*(mouse.x-position.x)+(mouse.y-position.y)*(mouse.y-position.y)) - 1.5;
	colorR *= sin( time / 1.0 ) * 0.9;
	
	float colorG = sqrt( (mouse.x-position.x)*(mouse.x-position.x)+(mouse.y-position.y)*(mouse.y-position.y) ) + sin( time );
	colorG *= sin( time / 20.0 ) * 0.9;
	
	float colorB = sqrt((mouse.x-position.x)*(mouse.x-position.x)+(mouse.y-position.y)*(mouse.y-position.y)) - 1.5;
	colorB *= sin( time / 6.0 ) * 0.5;
	
	gl_FragColor = vec4( vec3( 0.9 - colorR, 1.0 - colorG, 0.9 - colorB), 1.0 );
}