#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define r resolution
#define t time

void main( void ) {
	
	vec3 color = vec3(0.3, abs(sin(t)), 0.8);
	vec3 color2 = vec3(fract(cos(t)), 0.4, 0.2);

	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
	
	vec2 m = mod(p, 0.1 * exp(mouse.x + 1.)) - 0.1;

	vec2 q = m * mat2(cos(t), sin(t), -sin(t), cos(t));
	
	vec2 r = m * mat2(cos(t), sin(t), sin(t), cos(t));
	
	float k = 0.02 / length(q.x);
	float l = 0.02 / length(r.y);
	
	
	vec3 destColor = k * color + l * color2;
	
	gl_FragColor = vec4(destColor, 1.0 );

}