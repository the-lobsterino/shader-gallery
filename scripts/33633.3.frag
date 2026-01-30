#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 fo =vec3 (.8);
vec3 gh = vec3 (1);
vec3 gw = vec3 (1);

float DBFold(vec3 p, float fo, float g, float w){
    if(p.z>p.y) p.yz=p.zy;
    float vx=p.x-2.*fo;
    float vy=p.y-4.*fo;
    float v=max(abs(vx+fo)-fo,vy);
    float v1=max(vx-g,p.y-w);
    v=min(v,v1);
    v1=max(v1,-abs(p.x));
    return min(v,p.x);
}
//the coordinates are pushed/pulled in parallel


//the coordinates are pushed/pulled in parallel
vec3 DBFoldParallel(vec3 p, vec3 fo, vec3 g, vec3 w){
	vec3 p1=p;
	p.x=DBFold(p1,fo.x,g.x,w.x);
	p.y=DBFold(p1.yzx,fo.y,g.y,w.y);
	p.z=DBFold(p1.zxy,fo.z,g.z,w.z);
	return p;
}

float de(vec3 p) {
	vec4 jc = vec4(p, 1.0);
	
	float r2 = dot(p, p);
	float dd = 1.0;
	
	for(int i = 0; i < 6; i++) {
		p = p - clamp(p, -1.0, 1.0)*2.0;
		
		vec3 signs = sign(p);
		p = abs(p);
		p = DBFoldParallel(p, fo, gh, gw);
		
		p *= signs;
		r2 = dot(p, p);
		float t = clamp(1.0/r2, 1.0, 1.0/0.25);
		p *= t; dd *= t;
		
		p = p*4.0 + jc.xyz;
		dd = dd*4.0 + jc.w;
	}
	
	return (length(p) - 4.0)/dd - 0.04;
}

void main( void ) {
	vec2 p = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	p.x *= resolution.x/resolution.y;
	
	vec3 col = vec3(0);
	float at = time*0.3;
	
	vec3 ro = 6.0*vec3(sin(at), sin(at), cos(at));
	vec3 ww = normalize(vec3(0) - ro);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	vec3 rd = normalize(uu*p.x + vv*p.y + 1.97*ww);
	
	float t = 0.0;
	float g = 0.0;
	
	for(int i = 0; i < 200; i++) {
		float d = de(ro + rd*t);
		if(d < 0.0001*(1.0 + 10.0*t) || t >= 10.0) break;
		t += d*0.5;
		g += clamp(0.2 - d, 0.0, 1.0);
	}
	g = clamp(g*0.05, 0.0, 1.0);
	
	if(t < 10.0) {
		vec3 pos = ro + rd*t;
		vec2 h = vec2(0.0001*t, 0.0);
		vec3 nor = normalize(vec3(
			de(pos + h.xyy) - de(pos - h.xyy),
			de(pos + h.yxy) - de(pos - h.yxy),
			de(pos + h.yyx) - de(pos - h.yyx)
		));
		vec3 key = normalize(vec3(0.8, 0.7, -0.6));
		
		col = 0.2*vec3(1);
		col += 0.7*clamp(dot(nor, key), 0.0, 1.0);
		col += 0.4*clamp(0.2 + 0.8*dot(-key, nor), 0.0, 1.0);
	}
	
	col += pow(abs(g), 2.0)*vec3(0, 0, 1);
	
	gl_FragColor = vec4(col, 1);
}