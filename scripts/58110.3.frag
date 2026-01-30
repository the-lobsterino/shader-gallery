#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const float EPS = 0.001;

vec2 onRep(vec2 p, float interval) {
	return mod(p, interval) - interval * 0.5;
}

float distSphere(vec3 p, float r) {
	return length(p) - r;
}

float distBox(vec3 p, float w) {
	return length(max(abs(p) - w, 0.0));
}

float distBar(vec2 p, float interval, float width) {
	return length(max(abs(onRep(p, interval)) - width, 0.0));
}

float distTube(vec2 p, float interval, float width) {
	return length(onRep(p, interval)) - width;
}

float distScene(vec3 p) {
	float bar_x = distBar(p.zy, 1.0, 0.1);
	float bar_y = distBar(p.zx, 1.0, 0.1);
	float bar_z = distBar(p.xy, 1.0, 0.1);
	
	float tube_x = distTube(p.zy, 0.1, 0.025);
	float tube_y = distTube(p.zx, 0.1, 0.025);
	float tube_z = distTube(p.xy, 0.1, 0.025);

	return max(max(max(min(min(bar_y, bar_x), bar_z), -tube_x), -tube_y), -tube_z);
}

vec3 genNormal(vec3 p) {
	return normalize(vec3(
		distScene(p + vec3(EPS, 0.0, 0.0)) - distScene(p + vec3(-EPS, 0.0, 0.0)),
		distScene(p + vec3(0.0, EPS, 0.0)) - distScene(p + vec3(0.0, -EPS, 0.0)),
		distScene(p + vec3(0.0, 0.0, EPS)) - distScene(p + vec3(0.0, 0.0, -EPS))
	));
}

void main( void ) {
	// fragment position
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	vec3 cameraPos = vec3(-1., -1., 0.);
	vec3 cameraDirection = vec3(-0.2, 0.2, 1.0);
	vec3 cameraUp = vec3(0.0, 1.0, 0.0);
	vec3 cameraSide = cross(cameraDirection, cameraUp);
	float screenZ = 2.5;
//	vec3 rayDirection = normalize(cameraSide * p.x + cameraUp * p.y + cameraDirection * screenZ);
	
	vec3 cUp  = normalize(vec3(0.1, 0.4, 0.0));
	vec3 cDir = cross(cUp, vec3(-1.0, 0.0, 0.0));
	vec3 cSide = cross(cDir, cUp);
	float targetDepth = 1.0;
	vec3 rayDirection = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
	
	vec3 lightDir = normalize(vec3(1, 1, -2));
	
	float depth = 0.0;
	
	vec3 color = vec3(0.0);
	
	for (int i = 0; i < 64; i++) {
		vec3 rayPos = cameraPos + rayDirection * depth;
		float dist = distScene(rayPos);
		
		if (dist < EPS) {
			vec3 normal = genNormal(rayPos);
			float diffuse = clamp(dot(lightDir, normal), 0.1, 1.0);
			color = vec3(1.0, 0.1, 0.1) * diffuse;
			break;
		}
		
		depth += dist;
	}
	
	gl_FragColor = vec4(color + 0.05 * depth, 1.0);
}