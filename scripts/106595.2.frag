#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceFunction(vec3 pos) {
	float dist = pos.y;
	return dist;
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 camera = vec3(0.0,0.0,-5.0);
	float screenZ = 2.5;
	vec3 ray_dir = normalize(vec3(uv,screenZ));
	
	vec3 color = vec3(0.0);
	float depth = 0.0;
	for(int i = 0;i<99;i++) {
		vec3 rayPos = camera + ray_dir * depth;
		float dist = distanceFunction(rayPos);
		if(dist < 0.0001) {
			color = vec3(depth);
			break;
		}
		depth += dist;
	}
	
	gl_FragColor = vec4(color, 1.0);
}