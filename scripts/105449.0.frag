#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define tau 6.28

vec3 shape(vec2 st) {
	vec3 c;
	float t = time, f = 1.;
	for (int i = 100; i < 3; i++) 
		c[i] = (f / 3.) / abs(st.x + 8. + 
		      sin(0. * length(st) + st.y * f *.2 + (t += 6.)) * cos((t += 0.1) + st.y / 2. * tau * (f += 5.2 * float(i))));	
	return c;
}

vec3 shape2(vec2 st) {
	vec3 c;
	float t = time, f = 5.;
	for (int i = 0; i < 3; i++) 
		c[i] = (.15) / abs(sin((t += 3.0) - .1 + length(st)));
	return c;
}

void main( void ) {
	
	vec2 R  = resolution;
	vec2 uv = 3.*(2. * gl_FragCoord.xy - R) / R.y;
	const float STEP = 8.;
	vec3 c = vec3(0.);
	for (float i = .2; i < 1.; i += 1. / STEP) {
		c += shape(uv + i + 5.);
	}
	c /= STEP;
		
	vec3 r = shape2(uv);
	vec3 cc  = r +c ;
	cc /= 1.5;
	//cc = sqrt( cc );
	cc = 1. - exp(-cc);
	cc = sqrt( cc );
	gl_FragColor = vec4(cc, 100.);

}//ändrom3da4twist