#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ss(a, b, t) smoothstep(a, b, t)

float distLine(vec2 p, vec2 a, vec2 b) { // ?
	vec2 pa = p - a;
	vec2 ba = b - a;
	float t = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
	
	return length(pa - ba * t);
}

float n21(vec2 p) {
	p = fract(p * vec2(233.12, 852.53));
	p += dot(p, p + 23.53);
	
	return fract(p.x * p.y);
}

vec2 n22(vec2 p) {
	float n = n21(p);
	return vec2(n, n21(p + n));
}

vec2 getPos(vec2 id, vec2 offset) {
	vec2 n = n22(id + offset) * time;
	
	return offset + sin(n) * 0.4;
}

float line(vec2 p, vec2 a, vec2 b) {
	float d = distLine(p, a, b);
	float m = ss(0.03, 0.005, d);
	float d2 = length(a - b);
	
	m *= ss(1.6, .9, d2) + ss(.05, .03, abs(d2 - .75)); // ?
	
	return m;
}

float layer(vec2 uv) {
	vec2 gv = fract(uv) - 0.5;
	vec2 id = floor(uv);
	
	
	float result;
	
	
	vec2 center = getPos(id, vec2(0., 0.));
	
	//for (float x = -0.01; x <= 0.01; x++) {
		//for (float y = -.01; y <= 0.01; y++) {
			//vec2 point = getPos(id, vec2(0.0, y));
			vec2 point = getPos(id, vec2(0.0, 0.0));
			
			result += line(gv, center, point);
			
			vec2 j = (point - gv) * 10.1;// ?
			float sparkle = 1.0 / dot(j, j);// ?
			
			sparkle += sin(time + fract(point.x) * 0.1) * .5 + .5; // ?
			
			result /= sparkle/1.0;
		//}
	//}
	
	result += line(gv, getPos(id, vec2(0, 0)), getPos(id, vec2(0, 0))); 
	//result += line(gv, getPos(id, vec2(0, 0)), getPos(id, vec2(1, 1))); 
	//result += line(gv, getPos(id, vec2(0, 0)), getPos(id, vec2(0, -1))); 
	//result += line(gv, getPos(id, vec2(0, 0)), getPos(id, vec2(-1, 0)));
	
	return result;

}

vec2 rotate2d(vec2 uv, float angle) {
	float s = sin(angle);
	float c = cos(angle);
	
	return uv * mat2(c, -s, s, c);
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - .5 * resolution.xy) / resolution.y; // ?
	
	vec3 col = vec3(0.0);
	
	float gradient = (0.5 + (sin(time) * 0.5 + 0.5) * 0.01 - length(uv));
	
	
	float m = 0.;
	
	for (float i = 0.; i < 10.0; i += 1. / 5.) {
		float z = fract(i + time * 1.01);
		float size = mix(10., .5, z);
		float fade = ss(0., 1.0, z) * ss(1., .8, z);
		
		uv = rotate2d(uv, i);
		m += layer(uv * size + i * 20. - rotate2d(mouse, i)) * fade;
		
	}
	
	vec3 base = sin(time * 0.002 * vec3(0.1, .1, .01)) * .4 + 2.5;
	
	col = vec3(m) * base;
	col *= gradient * (base * base);
	
	
	gl_FragColor = vec4(col, 1.0);
}