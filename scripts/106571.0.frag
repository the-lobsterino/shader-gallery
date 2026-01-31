#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .01


float DistLine(vec3 ro, vec3 rd, vec3 p) {
	return length(cross(p - ro, rd)) / length(rd);
}

vec3 knot() {
	float x = sin(time) + 2.0 * sin(2.0 * time);
	float y = cos(time) + 2.0 * cos(2.0 * time);
	float z = -sin(3.0 * time);
	
	return vec3(x, y, z) * .1;
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy; // 0 <> 1
    	uv -= .5;
   	uv.x *= resolution.x/resolution.y;
    
	vec3 ro = vec3(0., 0., 1.);
	vec3 rd = vec3(uv.x, uv.y, 0.)-ro;
	    
	float t = time;
	vec3 p = knot();
	float d = DistLine(ro, rd, p);
    
    	d = smoothstep(.1, .09, d);
    
	gl_FragColor = vec4(d);
}
 