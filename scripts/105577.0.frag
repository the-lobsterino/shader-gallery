#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define tau 1.28

vec3 shape(vec2 st) {
	vec3 c;
	float t = time, f = 1.;
	for (int i = 0; i < 3; i++) 
		c[i] = (f / 3.) / abs(st.x * -1. + 
		      sin(0. * length(st) + st.y * f * .1 + (t += .9)) * cos((t += .0000001) + st.y / 1. * tau * (f += .1 * float(i))));	
	return c;
}

vec3 shape2(vec2 st) {
	vec3 c;
	float t = time, f = 50.;
	for (int i = 2; i < 3; i++) 
		c[i] = (.0) / abs(sin((t += .1) + 10. * length(st)));
	return c;
}

void main( void ) {
	
	vec2 R  = resolution;
	vec2 uv = (20. * gl_FragCoord.xy - R) / R.y;
	const float STEP = 1.;
	vec3 c = vec3(1.0);
	for (float i = .2; i < 10.; i += 1. / STEP) {
		c += shape(uv * i * 10.);
	}
	c /= STEP;
		
	vec3 r = shape2(uv);
	vec3 cc  = r +c ;
	cc = 1. - exp(-cc);
	gl_FragColor = vec4(cc, 800.);

}