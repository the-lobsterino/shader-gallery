#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphereSize = .6;

vec3 trans(vec3 p){
    return mod(p, 8.0) - 1.;
}

float sphereDistanceFunction(vec3 position, float size) {
	return length((position)) - size;
}

vec3 getNormal(vec3 pos, float size) {
	float ep = 0.001;
	return normalize(
		vec3(
			sphereDistanceFunction(pos, size) - sphereDistanceFunction(vec3(pos.x - ep, pos.y, pos.z), size),
			sphereDistanceFunction(pos, size) - sphereDistanceFunction(vec3(pos.x, pos.y - ep, pos.z), size),
			sphereDistanceFunction(pos, size) - sphereDistanceFunction(vec3(pos.x, pos.y, pos.z - ep), size)
		)
	);
}

void main( void ) {
	vec2 position = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
	vec3 cameraPosition = vec3(0., 0., 10.);
	float screenZ = 4.;

	vec3 lightDirection = normalize(vec3(sin(time * 3.), cos(time * 2.) * 2., 1.));
	vec3 rayDirection = normalize(vec3(position, screenZ) - cameraPosition);
	vec3 color = vec3(0.);
	float depth = 0.;
	
	for (int i = 0; i < 99; i++) {
		vec3 rayPosition = cameraPosition + rayDirection * depth;	
		float dist = sphereDistanceFunction(rayPosition, sphereSize);
	
		if (dist < 0.0001) {
			vec3 normal = getNormal(cameraPosition, sphereSize);
			float diffalent = dot(normal, lightDirection);
			color = vec3(diffalent) + vec3(1.0, .7, 0.2);
			break;
		}
		cameraPosition += rayDirection * dist;
	}

	gl_FragColor = vec4(color, 1.);
}
