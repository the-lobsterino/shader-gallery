// golden showers
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(void)
{
	vec2 position = surfacePosition * 6.0;
	position.y += sin(time*2.1+position.x*1.66)*0.3;
	position.x = dot(position,position);
	float color = 0.0;
		float t = 10.0 - time*0.1;
		float tri1 = sin(position.x+position.y + time * 4.0) * sin(position.x * position.y * 3.0);
		float tri2 = position.x;
		color += 1.0/distance(position,vec2(tri2,tri1));
	gl_FragColor = vec4(color * vec3(.3, 0.35, 0.18), 1.0);
}