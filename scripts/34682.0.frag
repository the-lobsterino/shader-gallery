#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14159265358979
float box(vec2 p, vec2 b, float r)
{
  return length(max(abs(p)-b,0.0))-r;
}

vec3 color(float x, vec3 a, vec3 b, vec3 c, vec3 d)
{
	return a + b*cos(2.0*PI*(c*x + d - 0.5*time));
}

void main( void ) {
	vec2 p = -1.0 + 2.0*gl_FragCoord.xy/resolution.xy;
	p.x *= resolution.x/resolution.y;
	float d = box(p, vec2(mouse.x*cos(time), -0.01*sin(time)), 0.9);
	vec3 col = color(d, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, mouse.x, mouse.y));
	gl_FragColor = vec4(col, 1.0);
}