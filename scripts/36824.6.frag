#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// SOMEBODY - get rid of swimming textures.

// FractalPseudoCrystal v2
// more perspective - more colors - more fun ;-) I.G.P.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float hash(float n) {
	return fract(sin(n)*43578.5453);
}

float noise(float g) {
	float p = floor(g);
	float f = fract(g);
	
	return mix(hash(p), hash(p + 1.0), f);
}

float noise(vec3 g) {
	vec3 p = floor(g);
	vec3 f = fract(g);
	
	f = f*f*(3.0 - 2.0*f);
	float n = p.x + p.y*57.0 + p.z*113.0;
	
	float x = mix(hash(n), hash(n + 1.0), f.x);
	float y = mix(hash(n + 57.0), hash(n + 58.0), f.x);
	float z = mix(hash(n + 113.0), hash(n + 114.0), f.x);
	float w = mix(hash(n + 170.0), hash(n + 171.0), f.x);
	
	return mix(mix(x, y, f.y), mix(z, w, f.y), f.z);
}

float fbm(vec3 p) {
	float f = 0.0;
	f += 0.5000*noise(p); p *= 2.3;
	f += 0.2500*noise(p); p *= 2.1;
	f += 0.1250*noise(p); p *= 2.5;
	f += 0.0625*noise(p);
	
	return f;
}

void rotate(inout vec2 p, float a) {
	float s = sin(a);
	float c = cos(a);
	
	p = mat2(c, s, -s, c)*p;
}

float box(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float de(vec3 p) {
	//return min(box(p, vec3(1)), p.y + 1.0);
	vec4 q = vec4(p, 1);
	q.xyz -= 1.0;
	
	for(int i = 0; i < 6; i++) {
		q.xyz = abs(q.xyz + 1.0) - 1.0;
		q /= clamp(dot(q.xyz, q.xyz), 0.25, 1.0);
		q *= 1.1;
		
		rotate(q.xz, 0.8);
		rotate(q.xy, -0.1);
	}
	
	return min((length(q.xyz) - 1.3)/q.w, p.y + 1.0);
}

float trace(vec3 ro, vec3 rd, float mx) {
	float t = 0.0;
	for(int i = 0; i < 120; i++) {
		float d = de(ro + rd*t);
		if(d < 0.001 || t >= mx) break;
		t += d*0.5;
	}
	
	return t < mx ? t : -1.0;
}

float bump(vec3 p) {
	float f =  smoothstep(0.0, 1.0, noise(4.0*p));
	return (1.0 - f)*fbm(5.0*p);
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.001, 0.0);
	vec3 n = vec3(
		de(p + h.xyy) - de(p - h.xyy),
		de(p + h.yxy) - de(p - h.yxy),
		de(p + h.yyx) - de(p - h.yyx)
	);
	
	vec3 b = vec3(
		bump(p + h.xyy) - bump(p - h.xyy),
		bump(p + h.yxy) - bump(p - h.yxy),
		bump(p + h.yyx) - bump(p - h.yyx)
	);
	
	return normalize(n) + 20.0*b;
}

float ao(vec3 p, vec3 n) {
	float o = 0.0, s = 0.005;
	
	for(int i = 0; i < 15; i++) {
		float d = de(p + n*s);
		o += (s - d);
		s += s/(float(i) + 1.);
	}
	
	return 1.0 - clamp(o, 0.0, 1.0);
}

vec3 color1 = vec3(0.17, 0.4, 1.0);

vec3 HSV(float h, float s, float v)
{ 
	const vec3 t = vec3(1.0, 2.0 / 3.0, 1.0 / 3.0);
	vec3 p = abs(fract(vec3(h) + t) * 6.0 - vec3( 3.0));
	return v * mix(vec3(1.0), clamp(p - vec3(1.0), 0.0, 1.0), s);
}


vec3 render(vec3 ro, vec3 rd) {

//	vec3 col = stars();
	vec3 col = vec3(0);
	color1 = HSV(time*0.04, 0.9+0.1*sin(time*0.1), 1.);
	float t = trace(ro, rd, 10.0);
	if(t < 0.0) return col;
	
	vec3 pos = ro + rd*t;
	vec3 nor = normal(pos);
	vec3 ref = normalize(reflect(rd, nor));
	
	col = vec3(1.0)*ao(pos, nor);
	
	col += 5.0*clamp(1.0 + dot(rd, nor), 0.0, 1.0)
		*step(0.0, -trace(pos + nor*0.001, ref, 10.0));
	
	if(pos.y > -0.99) {
		float f =  smoothstep(0.0, 1.0, noise(4.0*pos));
		float a = atan(pos.y, pos.x)*atan(pos.z, pos.x)*atan(pos.z, pos.y);
		
		vec3 mat = mix(vec3(0.5), vec3(0.6), noise(30.0*a));
		mat = mix(mat, color1, 1.0 - f);
		mat = mix(mat, vec3(-0.30), (1.0 - f)*fbm(8.0*pos));
		
		col *= mat;
	}
	
	return col;
}

void main( void ) {
	vec2 uv = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
	
	float time = 0.03*time - mouse.x * 4.;
	float camDist = 5.5 - mouse.y*5.0;
	vec3 ro = vec3(camDist*cos(time), 4.+mouse.y*2., camDist*sin(time));
	vec3 ww = normalize(-ro);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	vec3 rd = normalize(uv.x*uu + uv.y*vv + 1.97*ww);
	
	vec3 col = render(ro, rd);
	
	col = 1.0 - exp(-0.2*col);
	col = pow(col, vec3(1.0/2.2));
	
	gl_FragColor = vec4(col, 1);
}