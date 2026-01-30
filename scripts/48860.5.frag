#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define max3(a) max(max(a.x, a.y), a.z)

const vec3 scatterCoeff = vec3(0.25, 0.5, 0.9);

float map(vec3 p){
	float scene = p.y + 0.5;
	scene = length(fract(p) - 0.5) - 0.2;
	return max(scene, 0.0);	
}

float rayMarch(vec3 direction){
	const int steps = 256;
	
	vec3 position = direction;
	float t = 0.0;
	
	for (int i = 0; i < steps; i++){
		vec3 p = vec3(0.0, 0.0, time * 0.5) + position * t;
		float d = map(p);
		if (d < 0.0005 || t > 1000.0) break;
		t += d * 0.5;
	}
	return t;
}

vec3 generateNormals(vec3 pos){
	const float delta = 0.000001;
	
	vec3 px = pos + vec3(delta, 0.0, 0.0);
	vec3 py = pos + vec3(0.0, delta, 0.0);
	vec3 pz = pos + vec3(0.0, 0.0, delta);
	
	float d0 = rayMarch(pos);
	float dx = rayMarch(px);
	float dy = rayMarch(py);
	float dz = rayMarch(pz);
	
	float fx = (d0 - dx) / delta;
	float fy = (d0 - dy) / delta;
	float fz = (d0 - dz) / delta;
	
	return normalize(vec3(fx, -fy, fz));
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy) / resolution.xy * 2.0 - 1.0;
	vec3 worldPosition = vec3(position, 1.0);
	
	float fog = rayMarch(worldPosition);
	vec3 normals = generateNormals(worldPosition);

	vec3 color = vec3(1.0) - exp2(-fog * 0.1);

	gl_FragColor = vec4(color, 1.0 );

}