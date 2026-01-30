#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv1 = vec2(gl_FragCoord.x, gl_FragCoord.y);
	vec2 uv = uv1 * vec2(2,2) - vec2(1,1);

	float color = fract(atan(gl_FragCoord.y/gl_FragCoord.x) * 0.159 + 0.5 + time);
	
	gl_FragColor = vec4(color,1,1,1);

}