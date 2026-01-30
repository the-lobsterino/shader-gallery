#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_VIEW_STEPS 512

float genk1d(float x){
	return fract(sin(x) * 43758.5453123);	
}

float genk2d(vec2 xy){
	return genk1d(xy.x + genk1d(xy.y));	
}

float genk3d(vec3 xyz){
	return genk1d(xyz.x + genk1d(xyz.y + genk1d(xyz.z)));	
}

float smooth(vec3 position){
	vec3 u = fract(position);
	vec3 n = floor(position);
	
	u = u * u * (3.0 - 2.0 * u);
	
	return mix(mix(mix( genk3d(n), genk3d(n + vec3(1, 0, 0)), u.x),
                   mix( genk3d(n + vec3(0, 1, 0)), genk3d(n + vec3(1, 1, 0)), u.x), u.y),
               mix(mix( genk3d(n + vec3(0, 0, 1)), genk3d(n + vec3(1, 0, 1)), u.x),
                   mix( genk3d(n + vec3(0, 1, 1)), genk3d(n + vec3(1, 1, 1)), u.x), u.y), u.z);;
}

float signedDistance(vec3 position){
	float dist = 0.0;
	
	vec3 dPos = position + vec3(0.0, 0.0, -4.0);
	vec3 fPos = floor(dPos);
	
	float l = 0.5;
	dist = smooth(dPos) - l;
	
	return (position.y + 1.0) + dist;
}

void march(vec3 worldVector, inout vec3 worldPosition, inout bool isSky){
	float totalDepth = 0.0;
	
	for (int i = 0; i < MAX_VIEW_STEPS; ++i){
		float dist = signedDistance(worldPosition);
		totalDepth += dist;
		
		if (totalDepth > 60.0) {isSky = true; break;}
		if (dist < 0.001) break;
		
		worldPosition += dist * worldVector * 0.5;
	}
	
	return;
}

vec3 calculateNormal(vec3 position){
	const vec2 delta = vec2(0.001, 0.0);
	
	float d0 = signedDistance(position);
	
	float dx = d0 - signedDistance(position + delta.xyy);
	float dy = d0 - signedDistance(position + delta.yxy);
	float dz = d0 - signedDistance(position + delta.yyx);
	
	return normalize(vec3(dx, dy, dz));
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	vec2 wPosition = (position * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
	vec3 worldVector = normalize(vec3(wPosition, 1.0));
	
	vec3 worldPosition = vec3(0.0, 0.0, exp(time));
	bool isSky = false;
	
	march(worldVector, worldPosition, isSky);
	vec3 worldNormal = isSky ? vec3(0.0) : calculateNormal(worldPosition);
	
	float NoZ = worldNormal.z;
	float NoV = dot(worldNormal, worldVector);
	
	
	vec3 color = vec3(NoV / sqrt(NoV * NoV + NoV));

	gl_FragColor = vec4(color, 1.0 );

}