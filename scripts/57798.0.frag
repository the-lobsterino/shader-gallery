#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float seg_dist(in vec3 r, in vec3 p, in vec3 q){
	if(dot(r-p, q-p)<0.0)return length(r-p);
	if(dot(r-q, p-q)<0.0)return length(r-q);
	return length(cross(r-p, q-p)) / length(q-p);
}

float dist(in vec3 pos){
	float res=1e9;
	for(int i=0;i<5;i++){
		for (int j = 0; j < 5; j++) {
		float u = time*2.0 + 6.2832 * float(i) / 5.0;
		float v = time*2.0 + 6.2832 * float(i+1) / 5.0;
		vec3 p = vec3(cos(u)*3.0, -1.0, sin(u)*3.0);
		vec3 q = vec3(cos(v)*3.0, -1.0, sin(v)*3.0);
		float d;
		vec3 pl = pos * (float(j) * 0.4 + 0.4 - 0.4 * mod(time, 1.0) / 1.0);
		d = length(pl - p) - 0.6;
		res = min(res, d);
		d = seg_dist(pl, p, q) - 0.2;
		res = min(res, d);
	}
	}
	return res;
}

vec3 calcNormal(in vec3 pos){
	vec2 e=vec2(1,-1)*1e-2;
	return normalize(dist(pos+e.xxx)*e.xxx + dist(pos+e.xyy)*e.xyy + dist(pos+e.yxy)*e.yxy + dist(pos+e.yyx)*e.yyx);
}

float calcAO(in vec3 pos, in vec3 nor){
	float res=1.0;
	for(int i=1;i<=5;i++){
		float d=0.1*float(i);
		float w=pow(0.7, float(i));
		res -= (d-dist(pos+d*nor))*w;
	}
	return res;
}

void main( void ) {
	vec2 position = ( (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y );
	vec3 ro = vec3(0,15,30);
	vec3 fwd = normalize(-ro);
	vec3 up = vec3(0,1,0); up -= fwd * dot(fwd, up); up = normalize(up);
	vec3 right = normalize(cross(fwd, up));
	vec3 rd = normalize(fwd + 0.3 * (position.x * right + position.y * up));
	
	float t=0.1;
	for(int i=0;i<50;i++){
		vec3 pos = ro + t * rd;
		float d=dist(pos);
		if(d<1e-3){
			vec3 nor = calcNormal(pos);
			float ao = calcAO(pos, nor);
			gl_FragColor = vec4(vec3(1.5,0,0) * clamp(dot(nor, -rd), 0.0, 1.0) * ao, 1);
		}
		t+=d;
		if(t>1e2)break;
	}
	gl_FragColor = pow(gl_FragColor, vec4(0.4545));
}