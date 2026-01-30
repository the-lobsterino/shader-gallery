#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 uv = 2.0 * ( gl_FragCoord.xy / resolution.xy ) - 1.0;

	float col = 0.0;
	uv.x += sin( time * 6.0 + uv.y * 1.5 ) * mouse.y;
        col+= abs(.066/uv.x)*mouse.y;
        col = 1.0 - col;
	gl_FragColor = vec4(col,col,col, 1.0 );}