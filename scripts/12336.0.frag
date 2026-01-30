#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	gl_FragColor = vec4(abs(gl_FragCoord.xy - (resolution.xy/2.0))/resolution.xy, abs(gl_FragCoord.xy - (resolution.xy/2.0))/resolution.xy );
}
