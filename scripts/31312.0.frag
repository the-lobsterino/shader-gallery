#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle_radius = 0.2*sin(time) + 0.295;
vec4 circle_color = vec4(0.2, 0.9, 0.7, 1.0);
vec2 circle_center = vec2(0.5, 0.5);

void main( void )
{
	vec2 uv = gl_FragCoord.xy / resolution.xy - circle_center;
	uv *= resolution.xy / resolution.y;
	float dist =  sqrt(dot(uv, uv));
	float delta = fwidth(dist*1.8);
	float t = 1.0 + smoothstep(circle_radius, circle_radius+delta, dist) 
		      - smoothstep(circle_radius-0.01-delta, circle_radius-0.01, dist);
	
	gl_FragColor = mix(circle_color, vec4(0), t);
}