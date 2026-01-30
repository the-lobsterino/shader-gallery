#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(void)
{
	vec2 position = surfacePosition;
	//float t = time * 0.2;
	vec3 rgb = vec3(0);
	float color = 0.02/distance(position,vec2(0,0));
	//rgb += color * vec3(sin(time+float(1)), sin(time+float(3)), sin(time+float(5)));
	rgb += color * vec3(sin(time+float(5)), sin(time+float(1)), sin(time+float(3)));
	
	gl_FragColor = vec4(rgb,1.0);
}