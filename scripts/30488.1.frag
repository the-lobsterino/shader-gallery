#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float saturate(float a) {
	return clamp(a, 0.0, 1.0);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy;
	
	float period = 30.0;
	float width = 0.51;
	float x = 1. - step(width, mod(position.x, period));
	float y = 1. - step(width, mod(position.y, period));
	
	float v =  saturate(x + y);
	vec3 color = vec3(v, v, v);

	gl_FragColor = vec4(color, 1.0 );

}