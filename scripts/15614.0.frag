#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define pi 3.14159265358
void main( void ) {

	vec2 position = ( gl_FragCoord.xy - mouse.xy*resolution.xy ) / resolution.yy ;

	float color = pow(1.0-length(position)+0.25,40.0);
	gl_FragColor = vec4( color*1.0,color*1.0,color/1.0, 1 );

}