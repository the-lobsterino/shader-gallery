#ifdef GL_ES
precision mediump float;
#endif

// bollock
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592

void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv = uv * 2. - 1.;
	float color = distance(uv.y,0.);
	color /= distance(uv.x,.1);
	gl_FragColor = vec4(vec3(color), 1.);
}