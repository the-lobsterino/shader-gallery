#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 trans(vec3 p) {
	return p+5.0 - 2.0;
}

float distanceFunction(vec3 p) {
	vec3 q = abs(trans(p));
	return length(max(q - vec3(1.0), 0.0)) - 0.1;
}

vec3 getNormal(vec3 p) {
	float eps = 0.001;
	float dist = distanceFunction(p);
	return normalize(vec3(
		distanceFunction(vec3(p.x + eps, p.y, p.z)) - dist,
		distanceFunction(vec3(p.x, p.y + eps, p.z)) - dist,
		distanceFunction(vec3(p.x, p.y, p.z + eps)) - dist));
}

vec3 rotX(vec3 v, float rad) {
	return vec3(
		v.x,
		v.y * cos(rad) - v.z * sin(rad),
		v.y * sin(rad) + v.z * cos(rad));
}

vec3 rotY(vec3 v, float rad) {
	return vec3(
		v.x * cos(rad) + v.z * sin(rad),
		v.y,
		-v.x * sin(rad) + v.z * cos(rad));
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution)/ min(resolution.x, resolution.y) ;

	vec3 cameraPos = vec3(1.0,-1.0,3.0);
	float screenZ = 2.0;
	vec2 m = (mouse - 0.5) * 4.0;
	vec3 rayDirection = normalize(rotY(rotX(vec3(p, screenZ), -m.y), m.x * 2.0));

	vec3 col = vec3(0.0);
	float depth = 0.0;
	float depth_ = 0.0;
	for (int i = 0; i < 100; i++) {
		vec3 rayPos = cameraPos + rayDirection * depth;
		vec3 rayPos_ = cameraPos + rayDirection * depth_;
		float dist = distanceFunction(rayPos*vec3(1,0.8,1)+vec3(1,1,9));
		float dist_ = distanceFunction(rayPos_+vec3(-2,-1,-3));
		if (dist < 0.001) {
			vec3 n = getNormal(rayPos);
			vec3 light = normalize(vec3(1.0, 2.0, -3.0));
			float diffuse = max(dot(n, light), 0.0);
			float dsdfs = normalize(length(rayPos.y)-mouse.y);//float(normalize(mouse));
			col = vec3(1.0, 1.0, 2.0) * diffuse
 ;//*time			
			break;
		}
		if (dist_ < 0.001) {
			
			col = vec3(time);
			}
		depth += dist;
		depth_+= dist_;
	}

	gl_FragColor = vec4(col, 1.0);
}
