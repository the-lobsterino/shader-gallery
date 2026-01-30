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
	//float t = time * 0.2;
	float color = 0.0;
	for (int i = 0; i < 12; ++i)
	{
		float t = float(i)/32.0 - time*0.1;
		float tri1 = abs(mod(t*2.0+0.55,1.0)-0.5)*2.0-0.5;
		float tri2 = clamp(abs(mod(t,1.0)-0.5)*8.0-2.0,-1.0,1.0);
		color += 0.03/distance(position,vec2(tri2,tri1));
	}
	gl_FragColor = vec4(color * vec3(0, 0.2, 1.6), 1.0);
//wip
}