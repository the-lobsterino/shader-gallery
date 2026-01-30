//Domain Coloring
//By nikoclass

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const float pi = 3.1415926;

vec3 rgb(float x) {
	x = clamp(x * 2.0, 0.0, 2.0);
	return 1.0 - max(vec3(0.0), vec3(x*x,(x-1.0)*(x-1.0), (x-2.0)*(x-2.0)));
}

vec3 hsv_to_rgb(float h, float s, float v)
{
	float c = v * s;
	h = mod((h * 6.0), 6.0);
	float x = c * (1.0 - abs(mod(h, 2.0) - 1.0));
	vec3 color;
 
	if (0.0 <= h && h < 1.0) {
		color = vec3(c, x, 0.0);
	} else if (1.0 <= h && h < 2.0) {
		color = vec3(x, c, 0.0);
	} else if (2.0 <= h && h < 3.0) {
		color = vec3(0.0, c, x);
	} else if (3.0 <= h && h < 4.0) {
		color = vec3(0.0, x, c);
	} else if (4.0 <= h && h < 5.0) {
		color = vec3(x, 0.0, c);
	} else if (5.0 <= h && h < 6.0) {
		color = vec3(c, 0.0, x);
	} else {
		color = vec3(0.0, 0.0, 0.0);
	}
 
	color.rgb += v - c;
 
	return color;
}
vec2 ez(vec2 z) {
	return exp(z[0]) * vec2(cos(z[1]), sin(z[1]));
}


vec2 i(vec2 z) {
	mat2 m = mat2(0.0, -1.0, 1.0, 0.0);
	return m*z;
}

vec2 complex_sine(vec2 z) {
	return i(ez(i(z)) - ez(-i(z))) / -2.0;
}

void main( void ) {

	vec2 p = - 0.5 + ( gl_FragCoord.xy / resolution.xy );
	
	p *= 10.0;
	
	p = complex_sine(p);
	
	float angle = atan(p.y, p.x) / 2.0 / pi;
	
	vec3 color = hsv_to_rgb(angle, fract(length(p.x)) + fract(length(p.y)), 1.0);
	
	gl_FragColor = vec4( color, 1.0 );

}