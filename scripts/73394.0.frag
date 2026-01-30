#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 originSphere = vec3(0.5, 0.0, -0.5);

float dist_func(vec3 pos, float size) {

	return length(pos-originSphere) - size;
}

vec3 getNormal(vec3 pos, float size) {
	float ep = 1e-4;
	
	return normalize(vec3(
		dist_func(pos, size) - dist_func(vec3(pos.x - ep, pos.y, pos.z), size),
		dist_func(pos, size) - dist_func(vec3(pos.x, pos.y - ep, pos.z), size),
		dist_func(pos, size) - dist_func(vec3(pos.x - ep, pos.y, pos.z - ep), size)
		));
}

void main( void ) {

	vec3 lightDir = normalize(vec3(1.0,1.0, 1.0));
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	vec3 col = vec3(0.0); //initialize in black
	
	vec3 cameraPos = vec3(0.0, 0.0, 5.0);
	vec3 ray = normalize(vec3(pos, 0.0) - cameraPos);
	vec3 currentPos = cameraPos;
	vec2 mouseNorm = mouse * 2.0 - 1.0;
	//float size = 0.5 - length(mouseNorm);
	float size = 0.5;	
	
	for (int i = 0; i < 20; ++i) {
		float d = dist_func(currentPos, size);
		if (d < 1e-4) {
			vec3 normal = getNormal(currentPos, size);
			float diff = dot(normal, lightDir);
			col = vec3(diff) + vec3(0.1);
			break;
		}
		currentPos += ray * d;
	}

	gl_FragColor = vec4( col, 1.0); 
}