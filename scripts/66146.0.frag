#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (vec2 p) {
    return fract(sin(dot(p.xy,vec2(12.9898,78.233)))*43758.5453123);
}

void main(void){
	
	float t = pow(time, 1.2);
	vec2 m = mouse;
	vec2 r = resolution;
	
	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
	vec3 destColor = vec3(1.0, sin(time), 0.75);
	vec3 destForm = vec3(0.0);
	float f = 0.0001 / abs(p.x * p.y);
	for (float i = 0.0; i < 8.0; i++) {
		float jj = i + 1.0;
		float rr = random(p);
		vec2 qq = p + vec2(cos(rr + t * jj * .3925), sin(rr + t * jj * .19625));
		float ff = 0.00025 / abs(qq.x * qq.y);
		destForm += vec3(ff);
	}
	gl_FragColor = vec4(vec3(destColor*destForm), 1.0);
}