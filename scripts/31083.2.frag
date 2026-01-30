#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define W 0.01
void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	// distortion
	uv += (uv - 0.5) * (1.0 + 0.25 * sin(time)) * pow(1.0 - length(uv - 0.5), 1.0 + 0.1 * sin(time * 10.0));
	
	// grid
	float color = step(mod(uv.x, 0.1), W) + step(mod(uv.y, 0.1), W);
	
	gl_FragColor = vec4(color);

}