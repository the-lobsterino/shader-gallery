#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
        float aspect = resolution.x / resolution.y;
	vec2 position = gl_FragCoord.xy / resolution.xy;
	position.x *= aspect;
	vec2 center = vec2(0.5 * aspect, 0.5);
	float dis = distance(position, center);
	float color = smoothstep(0.498, 0.503, dis);
	gl_FragColor = vec4(color);
}