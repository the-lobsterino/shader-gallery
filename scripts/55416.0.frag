#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 lightDir = vec3(-0.577, 0.577, -0.577);

float sdSphere(vec3 ray, vec3 pos, float size){
	ray -= pos;
	float d = length(ray) - size;
	return d;
}

float sdBox(vec3 ray, vec3 pos, float size) {
	ray -= pos;
	ray = abs(ray) - size;
	return max(max(ray.x, ray.y), ray.z);
}

vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        sdSphere(p + vec3(  d, 0.0, 0.0), vec3(-1.), 0.3) - sdSphere(p + vec3( -d, 0.0, 0.0), vec3(-1.), 0.3),
        sdSphere(p + vec3(0.0,   d, 0.0), vec3(-1.), 0.3) - sdSphere(p + vec3(0.0,  -d, 0.0), vec3(-1.), 0.3),
        sdSphere(p + vec3(0.0, 0.0,   d), vec3(-1.), 0.3) - sdSphere(p + vec3(0.0, 0.0,  -d), vec3(-1.), 0.3)
    ));
}
void main( void ) {
	vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);
	
	vec3 cameraPos = vec3(-1.5, -0.5, -5);
	float screenZ = 2.5;
	vec3 rayDirection = normalize(vec3(p, screenZ));
	
	float depth = 0.0;
	vec3 col = vec3(0.0);
	
	for(int i = 0; i< 99; i++){
		vec3 rayPos = cameraPos + rayDirection * depth;
		float dist = sdSphere(rayPos, vec3(-1.), 0.3);
		float dist2 = sdBox(rayPos, vec3(1),0.2);

		dist = min(dist, dist2);
		
		if(dist < 0.0001){
			vec3 normal = getNormal(rayPos);
			float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
			col = vec3(diff);
			break;
		}
		
		depth += dist;
	}
	
	gl_FragColor = vec4( col, 1.0 );
}