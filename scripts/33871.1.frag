#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 mouse;
uniform float time;
uniform sampler2D s;
uniform vec2 resolution;
void main( void ) {
	gl_FragColor = vec4 (0);
	//gl_FragColor = mouse.x-ceil(texture2D(s, gl_FragCoord.xy/resolution));
}