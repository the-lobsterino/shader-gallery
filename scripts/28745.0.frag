#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// remember pow(NEGATIVE, WHATEVER) doesn't work right on nvidia

void main( void ) {

	vec2 uv = 2.0 * ( gl_FragCoord.xy / resolution.xy ) - 1.0;
	float col = 0.0;
	
	uv.x += sin( time * 8.0 + uv.y * 20.0 ) * pow(abs(sin(mod(time / 1.5, 1.0) - 0.5)), 4.0) * 2.0;
        col += abs(.005/uv.x);
	gl_FragColor = vec4(col, col, col, 1.0 );

}