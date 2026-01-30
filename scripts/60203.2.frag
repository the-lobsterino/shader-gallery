// 1.0 / gash
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(void)
{
	vec2 position = surfacePosition * 3.0;
	position.x = dot(position,position)*0.666;
	position = abs(position);
	
	float color = 0.;
	for (int i = 1; i < 89; ++i)
	{
		float t = float(i)/256.0 - time*.32;
		float tri1 = abs(mod(t*2.0+0.25,1.0)-0.5)*2.0-0.5;
		float tri2 = abs(mod(t,1.0)-0.5)*8.0-2.0;
		color += 0.006/distance(position,vec2(tri2,tri1+tri2));
	}
	gl_FragColor = vec4(pow(color,3.567) * vec3(0.2, 0.32, 0.76+sin(time+position.x*16.)*0.4), 1.0);
//wip
}