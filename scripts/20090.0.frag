#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi 3.1415926535

float hash(float x) {
	return fract(sin(x)*45768.2345);
}

void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
	vec3 col = vec3(0.0);
	for(int i = 0; i < 24; i++) {
		float q = hash(cos(float(i))*sin(float(i)));
		float t = time*q;
		float a = 2.0*pi*float(i)/12.0 + time*0.5;
		float x = cos(q + t)*sin(t);
		float y = cos(a)*cos(q*q*q + t);
		vec2 o = 0.7*vec2(x, y);
		float l = 0.02/length(p-o);
		col+= l*vec3(0.0, 0.0, 0.6);
	}
	gl_FragColor = vec4(col, 0.1);
}