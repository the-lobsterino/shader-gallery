#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535

void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
	//p = floor(p)+fract(p*4.0);
	vec3 col = vec3(0.2);
	for(int i=0; i<12; i++) {
		float a = 2.0*PI*float(i)/12.0 + time*0.2;
		float x = cos(time)*cos(a)-sin(a);
		float y = sin(time)*sin(a-time)+sin(time)*cos(a-time);
		vec2 q = cos(time)*vec2(x,y);
		float r = fract(a);
		float g = 1.0-r;
		col += 0.01/length(p-q)*vec3(r, g, 0.01);
	}
	gl_FragColor = vec4(vec3(col), 1.0);
}