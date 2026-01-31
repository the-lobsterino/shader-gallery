// IZ PATTERN 4 U
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 n1 = vec2(1.0, 1.0 + sin(time));
const vec2 p1 = vec2(0.10, 0.10);

vec2 n2 = vec2(-1.0 + sin(1.3*time), -1.0);
const vec2 p2 = vec2(-0.10, -0.10);

vec2 n3 = vec2(-1.0, 1.0 - cos(time));
const vec2 p3 = vec2(0.0, 0.40);

vec2 n4 = vec2(1.0, -1.0 + 3.0*sin(0.5*time));
const vec2 p4 = vec2(0.0, -0.40);



float side(vec2 n, vec2 p, vec2 q)
{
	return -0.6*min(0.0, dot(n, q-p));
}

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) - 1.0;
	p.x *= resolution.x/resolution.y; 	
	
	vec3 col = vec3(0.0);
	
	col.rgb += side(n1, p1, p);
	col.rgb += side(n2, p2, p);
	col.rgb += side(n3, p3, p);
	col.rgb += side(n4, p4, p);

	gl_FragColor = vec4(col, 1.0); 
}