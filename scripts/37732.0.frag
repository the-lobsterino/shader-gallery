precision mediump float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D prevScene;

float useTime = time * 0.5;

float rnd(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 v = floor(p);
	vec2 u = fract(p);
	u = u * u * (3.0 - 2.0 * u);
	float r = mix(
		mix(rnd(v), rnd(v + vec2(1.0, 0.0)), u.x),
		mix(rnd(v + vec2(0.0, 1.0)), rnd(v + vec2(1.0, 1.0)), u.x),
		u.y
	);
	return r * r;
}

float snoise(vec2 p){
	float n = 0.0;
	for(float i = 0.0; i < 4.0; ++i){
		float v = pow(2.0, 2.0 + i);
		float w = pow(2.0, -1.0 - i);
		n += noise(p * v) * w;
	}
	return n;
}

float sphere(vec3 p){
		return length(p - vec3(1.0 - 1.0 * time, 6.0 - 6.0 * time, 3.0 - 3.0 * time)) - 1.0;
}

float dFloor(vec3 p){
		float g = 2.0 * sin(useTime) * exp(-(p.x * p.x)/(30.0*sin(useTime*0.1)) -(p.z * p.z)/(30.0*sin(useTime*0.1)));

		g = pow(g * 0.5, 2.0) * 2.0;
				float n = snoise(p.xz)*0.1;
	return (dot(p, vec3(0.0, 1.0, 0.0)) + 4.0 - (n - 1.0) - g);
}

float starSpace(vec3 p){
    return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float distanceHub(vec3 p){
	return min(dFloor(p), sphere(p));
}

vec3 genNormal(vec3 p){
	float d = 0.001;
	return normalize(vec3(
		distanceHub(p + vec3(  d, 0.0, 0.0)) - distanceHub(p + vec3( -d, 0.0, 0.0)),
		distanceHub(p + vec3(0.0,   d, 0.0)) - distanceHub(p + vec3(0.0,  -d, 0.0)),
		distanceHub(p + vec3(0.0, 0.0,   d)) - distanceHub(p + vec3(0.0, 0.0,  -d))
	));
}

void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
		vec3 cPos = vec3(0.0,  -1.0,  10.0);
		vec3 cDir = vec3(0.0,  0.0, -1.0);
		vec3 cUp  = vec3(0.0,  1.0,  0.0);
		vec3 cSide = cross(cDir, cUp);
		float targetDepth = 1.0;
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
		float dist = 0.0;
		float rLen = 0.0;
		vec3  rPos = cPos;
	for(int i = 0; i < 128; ++i){
		dist = distanceHub(rPos);
		rLen += dist * 0.5;
		rPos = cPos + ray * rLen;
	}
		if(abs(dist) < 0.001){
		float fog = 1.0 - smoothstep(0.0, 50.0, length(rPos - cPos));
		vec3 normal = genNormal(rPos);
		vec3 light = normalize(vec3(mouse + 2.0, 3.0));
		float diff = max(dot(normal, light), 0.1);
		vec3 eye = reflect(normalize(rPos - cPos), normal);
		float speculer = clamp(dot(eye, light), 0.0, 1.0);
		speculer = pow(speculer, 20.0);
		gl_FragColor = vec4(vec3(diff + speculer) * fog, 1.0);
	}else{
		gl_FragColor = vec4(vec3(0.083, 0.17*abs(cos(time)), 0.17*abs(cos(time))), 1.0);
	}
}