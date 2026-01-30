#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

vec2 fbuf(vec2 p) {
	return -1.0 + 2.0*p;
}

vec2 tbuf(vec2 p) {
	return (p + 1.0)/2.0;
}

float seg(vec2 p, vec2 a, vec2 b, float r) {
	vec2 pa = p - a;
	vec2 ba = b - a;
	
	float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
	
	return length(pa - ba*h) - r;
}

float platform(vec2 p) {
	vec2 a = vec2(0);
	vec2 b = vec2(0.4, 0.1);
	
	vec2 c = vec2(-0.1, -0.3);
	vec2 d = vec2(-0.5, -0.3);
	
	vec2 e = vec2(-0.96, -0.6);
	vec2 f = vec2(-0.3, -0.8);
	
	vec2 g = vec2(-1.0, -0.9);
	vec2 h = vec2(1.0, -0.9);
	
	vec2 i = vec2(-1.0, -0.9);
	vec2 j = vec2(-1.0, 1.0);
	
	return min(min(min(min(seg(p, a, b, 0.01), 
		       seg(p, c, d, 0.01)),
		   seg(p, e, f, 0.01)), seg(p, g, h, 0.01)),
		   seg(p, i, j, 0.01));
}

vec2 normal(vec2 p) {
	vec2 h = vec2(0.001, 0.0);
	vec2 n = vec2(
		platform(p + h) - platform(p - h),
		platform(p + h.yx) - platform(p - h.yx));
	
	return normalize(n);
}

void main( void ) {
	vec2 p = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	float st = time;
	float t = mod(time, 4.0);
	if(p.y < -0.99) {
		
		vec4 buf = texture2D(backbuffer, vec2(0));
		vec2 pos = fbuf(buf.xy);
		vec2 opos = fbuf(buf.zw);
		
		if(t > 3.5 || st < 0.3) {
			pos = opos = vec2(0.2, 1);
		}
		
		vec2 acc = vec2(0.0, -0.01);
		vec2 vel = pos - opos;
		
		vec2 npos = pos + vel*0.9 + acc;

		
		if(platform(npos) < 0.06) {
			vec2 nor = normal(npos);
			npos = pos + nor*(0.006 + length(vel)) + vel;
		}
		
		gl_FragColor = vec4(tbuf(npos), tbuf(pos));
	} else {
		vec2 pos = fbuf(texture2D(backbuffer, vec2(0)).xy);
		
		vec3 col = mix(vec3(1, 0, 0), vec3(1), smoothstep(0.05, 0.07, length(p - pos)));
		
		col = mix(vec3(0.3, 0.3, 1.0), col, smoothstep(0.0, 0.02, platform(p)));
		
		gl_FragColor = vec4(col, 1);
	}
}