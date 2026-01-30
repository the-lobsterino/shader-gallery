#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

vec4 Texture(in vec2 position) {
	return vec4(length(position));
	return vec4(position.x, position.y, 0.0, 1.0);
}

void main( void ) {
	float t = time * 1.0;
	vec2 position = ( gl_FragCoord.xy -  resolution.xy*.5) / resolution.x;

	// 256 angle steps
	float angle = mod(atan(position.y,position.x), 2.0 * PI);
	float tunnel_x = angle / (2.0 * PI);
	tunnel_x = fract(tunnel_x + t);
	float rad = length(position);
	float depth = 1.0 / rad;
	depth = fract(depth + t);
	gl_FragColor = vec4(tunnel_x, 0.0, 0.0, 1.0);	
	
	gl_FragColor = Texture(vec2(tunnel_x, depth));
	
	gl_FragColor = Texture(position);
	//gl_FragColor = vec4(color,color,color,1.0)*vec4(light_color,1.0);
}