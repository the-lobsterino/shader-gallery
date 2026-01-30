#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.0);

#define DISTORT_FACTOR (-9.0)

float calculateCheckerTile(vec2 uv){
	vec2 cpos = cos(floor(uv) * pi);
	
	return cpos.x * cpos.y;
}

vec2 distortPosition(vec2 uv){
	uv = (uv * 2.0 - 1.0) * 1.169;
	float dist = length(uv) * 1.169;
	
	uv = uv / (dist * DISTORT_FACTOR + (1.0 - DISTORT_FACTOR));
	
	return uv * 0.5 + 0.5;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	position = distortPosition(position);

	vec3 color = vec3(0.0);
	     color = vec3(calculateCheckerTile(position * 20.0 + time));
	if (position.x > 1.0 || position.x < 0.0 || position.y > 1.0 || position.y < 0.0) color = vec3(0.0);

	gl_FragColor = vec4(color * (1.0 - distance(position, vec2(0.5)) * sqrt(2.0)), 1.0 );

}