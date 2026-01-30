#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define EPS 1e-3

// simple interference ray tracer

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rotateX(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
vec3 rotateY(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(c*p.x + s*p.z, p.y, c*p.z - s*p.x); }
vec3 rotateZ(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z); }
vec3 rotate(vec3 p, vec3 rot) { return rotateZ(rotateY(rotateX(p, rot.x), rot.y), rot.z); }

float sphere(vec3 p, vec3 c, float r) {
	return distance(p, c) - r;
}

float cube(vec3 p, vec3 c, vec3 l) {
	vec3 d = abs(p-c) - l;
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

void main(void) {
	vec2 uv = (2.*gl_FragCoord.xy - resolution.xy)/max(resolution.x, resolution.x);

	vec3 ro = vec3(uv.xy,1);
	vec3 rd = vec3(0,0,-1);
	float t = 0.;
	
	vec3 p_f = ro;
	for (int i=0; i<32; i++) {
		vec3 p = ro + t*rd;
		float s = min(min(sphere(p, vec3(.5,0,0), .2), cube(p, vec3(-.5,0,0), vec3(.1,.3,.1))+.005*sin(330.*p.x+133.*p.y+179.*p.z)), cube(rotateY(rotateX(p, time), time), vec3(0), vec3(.1)));
		t += .99*s;
		if (s <= EPS) {
			p_f = p;
			break;
		}
	}
	
	vec3 color = vec3(.5);
	if (distance(ro, p_f) > EPS) {
		color = vec3(sin(200.*t+time));
	}
	
	gl_FragColor = vec4(color, 1.);
}