#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14152965;
const float fovAngle = 60.0;
const float fov = fovAngle * PI / 360.0;
const vec3 lightDir = normalize(vec3(-0.4, 1.0, 0.7));

vec3 trans( vec3 p ) {
	return mod(p, 4.0) - 2.0;
}

float distanceFunc( vec3 p ) {
	vec3 q = abs(trans(p));
	return length(max(q - vec3(0.5, 0.5, 0.5), 0.0)) - max(sin(time * 4.0) * 0.3, 0.0);
}

vec3 getNormal( vec3 p ) {
	float d = 0.001;
	return normalize(vec3(
		distanceFunc(p + vec3(d, 0.0, 0.0)) - distanceFunc(p + vec3(-d, 0.0, 0.0)),
		distanceFunc(p + vec3(0.0, d, 0.0)) - distanceFunc(p + vec3(0.0, -d, 0.0)),
		distanceFunc(p + vec3(0.0, 0.0, d)) - distanceFunc(p + vec3(0.0, 0.0, -d))
	));
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / min(resolution.x, resolution.y);
	
	//vec3 cPos = vec3(0.0, 0.0, 2.0);
	vec3 cPos = vec3(sin(time)*3.6, 0.0, -time*8.0);
	vec3 cDir = vec3(0.0, 0.0, -1.0);
	vec3 cUp = vec3(0.0, 1.0, 0.0);
	vec3 cSide = cross(cDir, cUp);
	
	vec3 ray = normalize( cSide * p.x * sin(fov) + cUp * p.y * sin(fov) + cDir * cos(fov));

	float distance = 0.0;
	float rLen = 0.0;
	vec3 rPos = cPos;
	for(int i=0; i<128; i++) {
		distance = distanceFunc(rPos);
		rLen += distance;
		rPos = cPos + ray * rLen;
	}

	if (abs(distance) < 0.01) {
		vec3 normal = getNormal(rPos);
		float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
		gl_FragColor = vec4( vec3(diff), 1.0 );
	} else {
		gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	}
}