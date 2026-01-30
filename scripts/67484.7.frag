#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float center (float val) {
	return abs(fract(val)-.5);
}

vec2 center2d (vec2 xy) {
	return vec2(center(xy.x), center(xy.y));
}

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

float clampTime (float t) {
	return fract(t/4.);
}

void main( void ) {
	
	float t = center(clampTime(time))+10.;
	
	vec2 position = ( gl_FragCoord.xy / resolution.x );
	float x = gl_FragCoord.x / resolution.x;
	float y = gl_FragCoord.y / resolution.y;

	vec2 rxy = center2d(rotate(vec2(x,y), sin(t)));
	float r = 1.-(center(rxy.x)*t+center(rxy.y)*t*2.)/3.;
	float g = 1.-max(center(x)*t,center(y)*t)/2. + r/8.;
	float b = 0.0;
	vec2 gb = rotate(vec2(r, g),.15);

	gl_FragColor = vec4(r/g,sin(center(g/r/gb.x)),gb.x, 1.0 );

}