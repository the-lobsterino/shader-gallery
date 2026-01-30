#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 p) {
	return length(p) - 1.;
}

float scene(vec3 p) {
	
	return sphere(p);
}

vec3 getNormal(vec3 p) {
	vec2 o = vec2(0.001, 0.);
	return normalize(vec3(
		scene(p + o.xyy) - scene(p - o.xyy),
		scene(p + o.yxy) - scene(p - o.yxy),
		scene(p + o.yyx) - scene(p - o.yyx)
	));
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution) / resolution.y;
	
	vec3 camPos = vec3(0., 0., 2.);
	
	vec3 ray = normalize(vec3(p, -1.));
	
	vec3 light = vec3(-1., 1., 1.);
	
	bool hit = false;
	
	float curDist = 0.;
	
	float rayLen = 0.;
	
	vec3 rayPos = camPos;
	
	for (int i=0;i<64;i++) {
		curDist = scene(rayPos);
		rayLen += curDist;
		
		rayPos = camPos + ray * rayLen;
		
		if (abs(curDist)<0.001) {
			hit = true;
			break;
		}
	}
	
	if (hit) {
		vec3 n = getNormal(rayPos);
		float diff = dot(light, n);
		gl_FragColor = vec4( vec3(diff), 1.0 );
	}
		
}