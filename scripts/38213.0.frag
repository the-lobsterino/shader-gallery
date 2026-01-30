#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = (gl_FragCoord.xy/resolution.xy) * 2. - 1.;
	uv.x *= resolution.x/resolution.y;
	float a = time*.5;
	vec3 o = vec3(0,0,sin(a)*3.);
	vec3 r = normalize(vec3(uv,1));
	r.yz *=  mat2(cos(a), -sin(a), sin(a), cos(a));
	r.xy *=  mat2(cos(a), -sin(a), sin(a), cos(a));
	vec3 p;
	float t = 0.;
	for (int i=0; i<32; ++i) {
		p = o+t*r;
		float k = 15.;
		float d = length(fract(p)*1.-0.5) - .4 + .15 * sin(k*p.x)*sin(k*p.y)*sin(k*p.z);
		t += d*.5;
	}
	gl_FragColor = vec4(fract(p)*mod(p,3.)/(t*t*t),1);
}