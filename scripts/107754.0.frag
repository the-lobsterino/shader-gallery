#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceFunction(vec3 pos) {
    float d = length(pos) - 1.;
    return d;

}

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
	vec3 col = vec3(0);
	
	vec3 cameraPos = vec3(0,0,-5);
	float screenZ = 2.5;
	vec3 rayDirection = normalize(vec3(p, screenZ));
	
	float depth = 0.;
	for(int i = 0; i < 99; i++) {
		vec3 rayPos = cameraPos + rayDirection * depth;
		float dist = distanceFunction(rayPos);
		
		if(dist < 0.0001) {
			col = vec3(1.);
			break;
		}
		
		depth += dist;
	}
	
	gl_FragColor = vec4(col, 1);

}