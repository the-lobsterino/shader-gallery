// 250720N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// 230720N
// https://www.youtube.com/watch?v=yxNnRSefK94



float map(vec3 p) {
	vec3 q = fract(p)*2.0 - 1.0;	
	vec2 z = p.xy;
	float mb = .0; 
	return length(vec3(q.x, q.y, mb)) - 0.25;
}

float trace(vec3 o, vec3 r) {
	float t = 0.0;
	for (int i=0;i<32;++i) {
		vec3 p = o+r*t;
		float d = map(p);
		t += d*0.5;
	}
	return t;
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	uv = uv*2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	vec3 r = normalize(vec3(uv, 1.0));
	
	float the = time * 0.25;
	r.xz *= mat2(cos(the), -sin(the), sin(the), cos(the));
	vec3 o = vec3(0.0, time, time);
	
	float t = trace(o,r);
	float fog = 1.0 / (1.0 + t*t*0.1);
	vec3 fc = vec3(fog);
		
	gl_FragColor = vec4( fc, 1.0 );

}