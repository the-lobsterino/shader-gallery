#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy )*2.0 - 1.0);
	vec2 uv = gl_FragCoord.xy / resolution;
	position.x *= resolution.x / resolution.y;
	vec3 color = vec3(0.0);
	
	float speed = 2.0;

	color += vec3(0.15, 0.4, 0.35) * (1.0 / distance(
		vec2(1.0, 0.0)
		, position) * 0.15);
	
	// color small dot
	color += vec3(abs(sin(time*3.0)), abs(sin(time*0.3)), abs(sin(time*0.3+0.3)))* 0.15 * (1.0 / distance(
		vec2(sin(time*9.0) / 6.0 + 1.0, cos(time*9.0) / 6.0)
		, position) * 0.09);
	
	gl_FragColor = (texture2D(backbuffer, uv).rgba * 6.0 + vec4(color, 1.0)) / 7.0;
}