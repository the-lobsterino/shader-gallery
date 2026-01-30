#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float EPS = 0.001;

float distFunc(vec3 position){
	return length(position) - 0.5;
}

vec3 getNormal(vec3 position){
	vec3 normal = normalize(vec3(distFunc(vec3(position.x + EPS, position.y, position.z)) - distFunc(vec3(position.x, position.y, position.z)),
				    distFunc(vec3(position.x, position.y + EPS, position.z)) - distFunc(vec3(position.x, position.y, position.z)),
				    distFunc(vec3(position.x, position.y, position.z + EPS)) - distFunc(vec3(position.x, position.y, position.z))));
	return normal;
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	vec3 cameraPosition = vec3(-2.0 + mod(time * 0.8, 3.0), 0., -10.);
	float screenZ = 5.;
	vec3 rayDirection = normalize(vec3(position, screenZ));
	
	vec3 lightDirection = normalize(vec3(0.0, 1.0, 1.0));

	float depth = 0.;
	const int COLLISION_COUNT = 100;
	vec3 color;
	for(int i = 0; i < COLLISION_COUNT; i++){
		vec3 rayPosition = cameraPosition + rayDirection * depth;
		float distance = distFunc(rayPosition);
		if(distance < EPS){
			vec3 normal = getNormal(rayPosition);
			color = vec3(dot(normal, lightDirection) * -1.0);
			break;
		}
		depth += distance;
	}

	gl_FragColor = vec4(color, 1.0);
}