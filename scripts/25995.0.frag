#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(void)
{
	vec2 position = surfacePosition * 2.0;
	//float t = time * 0.5;
	float color = 0.3;
	for (int i = 0; i < 137; ++i)
	{
		float t = float(i)/69.0 - (time + mod(float(i),8.0)/6.0) * 0.16;
		float tri1 = abs(mod(t*2.0+0.25,1.0)-0.5)*2.0-0.5;
		float tri2 = clamp(abs(mod(t,1.0)-0.5)*8.0-2.0,-1.0,1.0);
		color += 0.01/distance(position,vec2(tri2,tri1));
	}
	gl_FragColor = vec3(color * vec3(2.0, 0.2, 0.2), 3.0);
//wip
}