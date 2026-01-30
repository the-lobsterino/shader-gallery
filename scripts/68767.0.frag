#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float X = position.x*64.;
	float Y = position.y*48.;
	float t = time*0.6;
	float o = sin(-cos(t+X/4.)-t+Y/9.+sin(X/(6.+cos(t*.1)+sin(X/9.+Y/9.))));
	gl_FragColor = vec4( vec3( o, o, o)*99., 1. );
}
