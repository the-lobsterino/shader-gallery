#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;

bool hit_circle(vec2 p, float radius){
	return length(p) < radius;
}
bool hit_square(vec2 p, float span){
	return abs(p.x) < span && abs(p.y) < span;
}
bool hit(vec2 p){
	const int N = 24;
	float ph = 3.14159265/4.;
	mat2 rot = mat2(cos(ph), -sin(ph), sin(ph), cos(ph));
	for(int i = 0; i <= N; i += 1){
		//if(hit_circle(p, 0.25)) return true;
		if(hit_square(p, 0.25)) return true;
		p += -sign(p)/3.;
		p *= (1.75)*rot;
	}
	
	return false;
}
bool trace_hit(vec2 p, vec2 r){
	bool hu = hit(p+r*vec2(0,-1));
	bool hr = hit(p+r*vec2(1,0));
	bool hd = hit(p+r*vec2(0,1));
	bool hl = hit(p+r*vec2(-1,0));
	return (hu==hd&&hl==hr);
}

void main( void ) {
	vec2 p = surfacePosition*2.;
	vec2 r = surfaceSize/(2.*resolution);
	
	gl_FragColor = vec4( 1.0 );
	gl_FragColor.gb *= float(trace_hit(p,r));
}