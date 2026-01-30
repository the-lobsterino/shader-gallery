#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = (gl_FragCoord.xy/resolution.xy)-0.5;
	
	vec3 color = vec3(fract(length(uv)*time));

	gl_FragColor = vec4(color, 1.0);

}