#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 calculateWorldVector(vec2 uv) {
	vec2 wuv = (uv * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
	
	return normalize(vec3(wuv, 1.5));
}

float intersectPlane(vec3 ro, vec3 rd, vec3 p, vec3 n) {
	float denom = dot(rd, n);
	
	float t = -1.0;
	
	if (denom > 1e-6) {
		vec3 p = p - ro;
		float newT = dot(p, n) / denom;
		
		if (newT > 0.0) {
			t = newT;	
		}
	}
	
	return t;
}

float intersectDisk(vec3 ro, vec3 rd, vec3 p, vec3 n, float r) {
	float t = intersectPlane(ro, rd, p, n);
	
	if (t > -0.5) {
		vec3 newP = ro + rd * t;
		vec3 v = newP - p;
		
		float d2 = dot(v, v);
		bool disk = sqrt(d2) < r;
		
		if (disk) {
			return t;	
		}
	}
	
	return -1.0;
}

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(0.0-0.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

void main( void ) {
	vec2 position = gl_FragCoord.xy / resolution.xy;
	vec3 worldVector = calculateWorldVector(position);
	
	vec3 ro = vec3(0.0, 0.0, -1.0);
	vec3 n = normalize(vec3(cos(time), -5.0, sin(time)));
	
	float disk = intersectDisk(ro, worldVector, vec3(0.0, -0.5, 0.8), n, 1.);
	
	vec3 color = vec3(0.0);
	
	if (disk > 0.0) {
		vec3 worldPosition = ro + worldVector * disk;
		
		color = vec3(noise(worldPosition.xz * 10.0));
	}

	gl_FragColor = vec4(color, 1.0 );

}