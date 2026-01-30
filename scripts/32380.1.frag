#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 hash(vec2 x) {
	vec2 n = vec2(dot(x, vec2(171, 311)), dot(x, vec2(269, 382)));
	return fract(sin(n)*43785.454);
}

vec2 voronoi(vec2 x) {
	vec2 p = floor(x);
	vec2 f = fract(x);
	
	vec2 mg, mr;
	float md = 8.0;
	
	for(int i=-1; i<=1; i++)
	for(int j=-1; j<=1; j++) {
		vec2 g = vec2(float(i), float(j));
		vec2 o = hash(p + g);
		o = 0.5 + 0.5*sin(o*3.14 + time);
		vec2 r = g + o - f;
		float d = dot(r, r);
		
		if(d < md) {
			md = d;
			mr = r;
			mg = g;
		}
	}
	
	md = 8.0;
	
	for(int i=-2; i<=2; i++)
	for(int j=-2; j<=2; j++) {
		vec2 g = mg + vec2(float(i), float(j));
		vec2 o = hash(p + g);
		o = 0.5 + 0.5*sin(o*3.14 + time);
		vec2 r = g + o - f;
		
		if(dot(mr-r, mr-r)>0.00001)
			md = min(md, dot(0.5*(mr+r), normalize(r-mr)));
	}
	
	return vec2(md, length(mr));
}

float map(vec3 p) {
	vec2 v = voronoi(p.zy);
	float r = smoothstep(0.04, 0.07, v.x);
	float f = smoothstep(0.0, 1.0, v.y);
	
	return p.x + 1.0 - 0.05*r + 0.3*f;
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.001, 0.0);
	vec3 n = vec3(
		map(p + h.xyy) - map(p - h.xyy),
		map(p + h.yxy) - map(p - h.yxy),
		map(p + h.yyx) - map(p - h.yyx)
	);
	
	return normalize(n);
}

float march(vec3 ro, vec3 rd) {
	float t = 0.0;
	
	for(int i=0; i<128; i++) {
		float h = map(ro + rd*t);
		if(h < 0.001 || t >= 20.0) break;
		t += h*.95;
	}
	
	return t;
}

vec3 material(vec3 p) {
	vec3 col = vec3(.8, .2, .2);
	
	float f = smoothstep(0.04, 0.08, voronoi(p.zy).x);
	col = mix(vec3(0), col, f);
	
	return col;
}

mat3 camera(vec3 e, vec3 l) {
	vec3 f = normalize(l - e);
	vec3 r = normalize(cross(vec3(0, 1, 0), f));
	vec3 u = normalize(cross(f, r));
	
	return mat3(r, u, f);
}

void main( void ) {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;
	
	vec3 ro = 3.0*vec3(1.0, 0, 0.5*time);
	vec3 rd = camera(ro, ro + vec3(-1, 1.5*cos(time*0.3), -1.0 + 2.0*mouse.x))*normalize(vec3(uv, 2.0));
	
	vec3 col = vec3(1, .8, .8);
	
	float i = march(ro, rd);
	
	if(i < 20.0) {
		vec3 pos = ro + rd*i;
		vec3 nor = normal(pos);
		
		vec3 lig = normalize(vec3(1.8, .7, .6));
		vec3 ref = reflect(rd, nor);
		
		float amb = 1.0;
		float dif = clamp(dot(lig, nor), 0.0, 1.0);
		float fre = pow(clamp(1.0 + dot(rd, nor), 0.0, 1.0), 2.0);
		float spe = pow(clamp(dot(lig, ref), 0.0, 1.0), 8.0);
		
		col =  0.4*amb*vec3(1.00, 1.00, 1.00);
		col += 0.7*dif*vec3(1.00, 0.97, 0.85);
		
		col *= material(pos);
		
		col += 0.5*fre*vec3(1.00, 1.00, 1.00)*amb*amb;
		col += 0.6*spe*vec3(1.00, 0.97, 1.00)*dif;
	}
	
	gl_FragColor = vec4(col, 1);
}