#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	
	gl_FragColor = vec4(0.6, 0.5+cos(p.x*50.0)*0.2, 0.2, 1.0 );
}