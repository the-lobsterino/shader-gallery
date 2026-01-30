#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float box(vec3 p, vec3 b){
	vec3 q = abs(p) - b;
	return length(max(q,0.)) + min(max(q.x,max(q.y,q.z)),0.);
}

mat2 rot(float a){
	return mat2(cos(a),sin(a),-sin(a),cos(a));
}

float fractBox(vec3 p){
	float d = 1e5;
	float s = 1.;
	for(int i=0; i<5; i++){
		p = abs(p) - vec3(abs(sin(time)/4.+.25));
		p.xy *= rot(time);
		p.zy *= rot(time);
		d = box(p, vec3(.5+.25));
		s+=1.;
	}
	return d;
}

float map(vec3 p){
	vec3 q = p;
	float k = 20.;
	//q = mod(q, k) - k * .5;
	q.xz *= rot(time);
	float d = max(box(q,vec3(1.2)),-fractBox(q));
	return d;
}
		

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	vec3 ro = vec3(0., 0., 4.5), dir = normalize(vec3(0.)-ro);
	vec3 up = vec3(0., 1., 0.);
	vec3 rd = normalize(cross(dir,up)*p.x+up*p.y+dir*.9);
	
	vec3 col = vec3(0.);
	float t, d = .0;
	float ac = .0;

	for(int i=0; i<64; i++){
		vec3 pos = ro + rd * t;
		d = map(pos);
		t += d;
		ac += exp(-.5*d);
		if(d<.001){
			//col = vec3(1.);
			break;
		}
	}
	col = vec3(ac)*.05*vec3(p*2.+.5,0.);
	
	gl_FragColor = vec4(col, 1.);

}