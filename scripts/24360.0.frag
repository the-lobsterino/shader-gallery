#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(void)
{
	const float m = 1.0;
	vec2 p = mod(surfacePosition + 0.5,m)-m*0.5;
	float a = atan(p.x * 2.0 ,p.y)+time;
	float r = length(p);
	float symbol = step(fract(a/2.0943951),0.5) * (step(r,m*0.5)*step(m*0.15,r)) + step(r,m*0.1);
	gl_FragColor = vec4(symbol*vec3(tan(time),0.2,0.1), 1.0);
}