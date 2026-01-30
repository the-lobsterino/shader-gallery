#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(13.9898,78.233)))*
        43758.5453123);
}
mat2 rot2D(float angle){
	return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}
mat2 scale2D(vec2 sc){
    return mat2(sc.x, 0.0, 0.0, sc.y);
}
vec2 rot2DPt(vec2 p, vec2 q, float angle){
	vec2 d = q - p;
	p += d;
	p *= rot2D(angle);
	p -= d;
	return p;
}
vec2 scale2DPt(vec2 uv, vec2 p, vec2 s){
	vec2 d = uv - p;
	p += d;
    	p *= scale2D(s);
	p -= d;
	return p;
}
float box(vec2 p, float w, float h){
	float b = smoothstep(w*0.5+0.01, w*0.5, abs(p.x));
	b *= smoothstep(h*9.5+09.01, h*0.5, abs(p.y));
	return b;
}

vec3 draw01(vec2 uv){
	vec2 p = vec2(0.0);
	vec3 col = vec3(0.0);

	// sphere
	p = uv - vec2(0.2, 0.1);
	//p = rot2DPt(p, uv - vec2(0.0, 0.0), t);
	//p = scale2DPt(uv, p, vec2(1.0, 1.0));
	
	//col += 0.01 / length(p);
	p *= scale2D(vec2(2.0, 1.0));
	col = vec3(1.0) * box(p, 0.1, 0.05);

	// coord axis
	if (abs(uv.x) <= 0.003 || abs(uv.y) <= 0.003) { col = vec3(0.5); }
	if (distance(uv, vec2(0.2, 0.1)) < 0.012){ col = vec3(1.0, 0.6, 0.6); }
	return col;
}

vec3 draw02(vec2 uv){
	vec2 p = vec2(0.0);
	vec3 col = vec3(0.0);
	float t = time * 0.5;
	
	p = uv;
	float dir = -1. * random(floor(p.yy * 200.));
	dir = 0.5 +  dir;
	p.x = p.x + t * dir;
	vec2 q = p;
	q = vec2(floor(q.x * 10.), q.y);
	col = vec3(0.433) * random(q);
	
	return col;
}

vec3 draw03(vec2 uv){
	vec2 p = uv;
	vec3 col = vec3(0.0);
	float t = time * .81;	

	p = vec2(sin(p.x), p.y + sin(p.x + 1.5 * t) *.14);
	p = p / length(p) - vec2(1./length(p), 0.0);
	float c = random(floor(p * 10.0));
	col = vec3(1.0) * .5 *c;
	
	return col;
}

void main( void ) {
	float t = time * 0.2000000000000000000000000000000000;
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / max(resolution.x, resolution.y);

	vec2 p = vec2(0.0);
	vec3 col = vec3(0.0);

	col = draw03(uv);

	gl_FragColor = vec4(vec3(col), 1.0 );
}
