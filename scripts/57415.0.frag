#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float makeTiles(vec2 uv){
	vec2 k = abs(fract(uv * 0.5 - 0.75) - 0.5);
	vec2 k2 = abs(fract(uv * 0.5 - 0.25) - 0.5);
	
	return step(max(min(k.x, k.y), min(k2.x, k2.y)), 0.25);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(0.0);
	float tiles = makeTiles(position * 4.0);
	
	color += tiles;

	gl_FragColor = vec4(color, 1.0 );

}