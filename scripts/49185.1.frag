#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141519

float rmax = 0.8;
float rmin = 0.3;
float points = 6.0;

void main( void ) {
	
	vec2 st = (gl_FragCoord.xy *2.0 - resolution.xy)  / resolution.y;
	
	float angle = atan(st.y, st.x) + time*1111.; //??? overflow ???
	float r = length(st);

	float pointangle = PI * (1.0+floor(4.*mouse.x)) / points;
	
	float a = mod(angle, pointangle) / pointangle;
	a = a < 0.5 ? a : 1.0 - a;	
	
	vec2 p0 = rmax * vec2(cos(0.0), sin(0.0));
	vec2 p1 = rmin * vec2(cos(pointangle / 2.0), sin(pointangle / 2.0));
	vec2 d0 = p1 - p0;
	vec2 d1 = r * vec2(cos(a), sin(a)) - p0;
	
	float isin = step(0.0, cross(vec3(d0, 0.0), vec3(d1, 0.0)).z);
	
	gl_FragColor = vec4(vec3(isin), 1.0);
}