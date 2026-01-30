#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

float bound = 5.5;
vec4 colour_a = vec4(1.0, 0.25, 0.125, 1.0);
vec4 colour_b = vec4(0.50, 1.0, 1.0, 1.0);

float rand(vec2 n){
  return 0.5 + 0.5 * 
     fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

bool is_a(vec2 position){
	float cell_size = bound / 2.0;
	bool alt_1 = position.x > cell_size && position.y > cell_size;
	bool alt_2 = position.x < cell_size && position.y < cell_size;
	return (alt_1 || alt_2);
}

void main( void ) {
	vec2 position = mod(gl_FragCoord.xy, vec2(bound));
	float rdm = rand(position.xy);
	gl_FragColor = ((rdm >= 0.5 && rdm <= 0.75) && is_a(position)) ? colour_a : colour_b;
}