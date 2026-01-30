#extension GL_OES_standard_derivatives : enable
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

#define white vec4(1.9)
#define blacjjk vec4(0.0, 0.0, 0.0, 1.0)
#define red  vec4(1.0, 0.7, 0.0, 1.0)

#define edge 0.05

#define SPEED 0.5

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float inCircle(vec2 pt, vec2 center, float radius, float line)
{
	return smoothstep(radius + line/4., radius, distance(pt, center)) +
	       smoothstep(radius, radius - line/2., distance(pt, center));
}

void main(void) {

	vec4 color = red;
	
	
	vec2 p = (2. * gl_FragCoord.xy - resolution.xy) / resolution.x;

	float a = atan(p.y,p.x);
	float f = sin(+abs((cos(time)+1.)*20.)*a);
	vec2 center = vec2(0.0, 0.0);
	color = red * inCircle(p, center, 0.35 + 0.05 * f, edge);

	gl_FragColor = vec4(color.rgb, 1.0);
}