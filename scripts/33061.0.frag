//  optimised by @dennishjorth for better performance.
//  Tried to make it more interesting, but mouse movement
//  is still available.

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159

float hash(float n) {
	return 0.0;
}

float map(vec3 p) {
	p.z += time*cos(time*0.1)*0.05;
	float n = abs(dot(cos(p.yzx*PI), sin(p*PI)));
	return 0.43 - n*(.36+cos(p.y*4.5+p.x*4.5+time*0.75+sin(time*2.6+p.z*2.5+p.x*2.5))*0.05);
}

float march(vec3 ro, vec3 rd) {
	float t = 0.0;
	
	for(int i = 0; i < 40; i++) {
		float h = map(ro + rd*t);
		if(abs(h) < 0.001 || t >= 10.0) break;
		t += h*1.0;
	}
	
	return t;
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.01, 0.0);
	vec3 n = vec3(
		map(p + h.xyy) - map(p - h.xyy),
		map(p + h.yxy) - map(p - h.yxy),
		map(p + h.yyx) - map(p - h.yyx)
	);
	return normalize(n);
}


mat3 camera(vec3 eye, vec3 lat) {
	vec3 ww = normalize(lat - eye);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	
	return mat3(uu, vv, ww);
}

void main( void ) {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;
	vec2 mo = -1.5 + 3.0*mouse;
	
	vec3 col = vec3(0);
	
	vec3 ro = vec3(0, 0, -1.1);
	vec3 rcd = camera(ro, vec3(1.0*mo.x, 0.5*mo.y, 0.0))*normalize(vec3(uv, 0.97));

	vec3 rd = rcd;
	float cx = cos(time*0.3);
	float sx = sin(time*0.3);
	rd.x = rcd.x * cx + rcd.y * sx;
	rd.y = rcd.x * sx - rcd.y * cx;
	
	float i = march(ro, rd);
	
	
	
	
	if(i < 10.0) {
		vec3 pos = ro + rd*i;
		
		vec3 nor = normal(pos);
		
		vec3 lig = normalize(vec3(0.8, 0.7, -0.6));
		
		float amb = nor.x + nor.y + nor.z;
		float spec = dot(nor,lig);
		col  = 0.5*lig*vec3(1)+pow(spec,20.0);
		
		vec3 mat = vec3(0.4, 1.7, 0.3);
		mat = mix(mat, vec3(0.5+3.0*cos(pos.y+time*0.2)*0.5, 0.6+cos(pos.x+time*0.3)*0.6, 0.6+2.0*cos(pos.z+time*0.7)*0.8), smoothstep(0.0, 1.0, 100.0));
		col *= mat;
		
		col += 0.2*vec3(1)*amb;
	}
	
	col = mix(col, vec3(0.9, 1.0, 0.9), 1.0 - exp(-i*0.05));
	
	gl_FragColor = vec4(col, 1);
}