#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define t time
#define r resolution

vec2 onRep(vec2 p, float interval) {
	return mod(p, interval) - interval * 0.5;
}

float barDist(vec2 p, float interval, float width) {
	return length(max(abs(onRep(p, interval)) - width, 0.0));
}

float tubeDist(vec2 p, float interval, float width) {
	return length(onRep(p, interval)) -width;
}


float distanceFunction(vec3 p) {
	float bar_x = barDist(p.yz, 1.0, 0.1);
	float bar_y = barDist(p.xz, 1.0, 0.1);
	float bar_z = barDist(p.xy, 1.0, 0.1);
	
	float tube_x = tubeDist(p.yz, 0.1, 0.025);
	float tube_y = tubeDist(p.xz, 0.1, 0.025);
	float tube_z = tubeDist(p.xy, 0.1, 0.025);
	//return max(max(tube_x, tube_y), tube_z);
	return max(max(max(min(min(bar_x, bar_y), bar_z), -tube_x), -tube_y), -tube_z);
}

vec3 getNormal(vec3 p) {
	float d = 0.0001;
	return normalize(vec3(
		distanceFunction(p + vec3(d, 0.0, 0.0)) - distanceFunction(p + vec3(-d, 0.0, 0.0)),
		distanceFunction(p + vec3(0.0, d, 0.0)) - distanceFunction(p + vec3(0.0, -d, 0.0)),
		distanceFunction(p + vec3(0.0, 0.0, d)) - distanceFunction(p + vec3(0.0, 0.0, -d))
	));
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
	
	vec3 lightDir = vec3(1.0, 0.477, 0.177);
	vec3 col = vec3(0.2, abs(sin(t* 0.5)), fract(t * 0.3));
	
	vec3 cameraPos = vec3(abs(sin( t * 0.05)) * 4.0, abs(cos(t * 0.3)) * 3.0, -5.0);
	float screenZ = 2.5;
	vec3 rayDirection = normalize(vec3(p, screenZ));
	
	float depth = 0.0;
	for(int i = 0; i< 99; i++) {
		vec3 rayPos = cameraPos + rayDirection * depth;
		float dist = distanceFunction(rayPos);

		
		if(dist < 0.0001) {
			vec3 normal = getNormal(rayPos);
			float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
	//gl_FragColor = vec4(vec3(diff) * col, 1.0);
			break;
		} else {
			gl_FragColor = vec4(vec3(1.0), 1.0);
		}
		
		depth += dist;
		
	}

}