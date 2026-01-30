#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float SCALE = 3.141592653589793;
const float SHIFT = -0.5 * 3.141592653589793;

void main( void )
{
	vec2 position = (gl_FragCoord.xy / resolution.xy);

	vec3 color = vec3(position.x);
	color *= SCALE * mouse.x * 16.0;
	color += vec3(0.0, SHIFT, 2.0 * SHIFT);

	gl_FragColor = vec4(cos(color) * vec3(1, 1, 1), 1.0);
}
