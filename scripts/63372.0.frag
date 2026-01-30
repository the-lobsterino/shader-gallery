// 170420 Necips mod.

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceFunction(vec3 pos) {
	float d = length(pos) - 0.5;
	return d;
}

float sdSphere(vec3 p, float r) {
	float d = length(p) - r;
	return d;
}

float sdPlane(vec3 p) {
	float d = p.y;
	return d;
}

float sdBox(vec3 p, float s) {
	p = abs(p) - s;
	return max(max(p.x, p.y), p.z);
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x,resolution.y);
	
	vec3 cameraPos = vec3(0.,0.,-5.);
	float screenZ = .08;
	vec3 rayDirection = normalize(vec3(p, screenZ));
	
	float depth = 0.0;
	vec3 col = vec3(0.0);
	
	for(int i=0; i<55; i++) {
		vec3 rayPos = cameraPos + rayDirection * depth;
		rayPos += vec3(1., 1, time * 3.);
		rayPos = mod(rayPos-2., 4.) -2.;
		float dist = sdSphere(rayPos, 0.1);
		if(dist < 0.0001) {
			col = vec3(1.);
			break;
		}
		depth += dist;
	}
	
	gl_FragColor = vec4(col,1.);
}