// bars - thygate@gmail.com
// rotation and color mix modifications by malc (mlashley@gmail.com)
// modified by @hintz 2013-04-30
#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
vec2 position;
vec4 color;
float c = cos(time/2.0);
float s = sin(time/2.0);
mat2 R = mat2(c,-s,s,-c);
float barsize = 0.15;
float barsangle = 200.0*sin(time*0.001);
vec4 bar(float pos, float r, float g, float b)
{
	return max(0.0, 1.0 - abs(pos - position.y) / barsize) * vec4(r, g, b, 1.0);
}
void main(void) 
{
	position = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.xx;
	position = 2.0*position * R; 				
	float t = time*0.5;
	vec4 color = vec4(0.0);
	color += bar(sin(t), 1.0, 0.0, 0.0);
	color += bar(sin(t+barsangle/6.*2.), 1.0, 0.5, 0.0);
	color += bar(sin(t+barsangle/6.*4.), 1.0, 1.0, 0.0);
	color += bar(sin(t+barsangle/6.*6.), 0.0, 1.0, 0.0);
	color += bar(sin(t+barsangle/6.*8.), 0.0, 1.0, 1.0);
	color += bar(sin(t+barsangle/6.*10.), 0.0, 0.0, 1.0);
	color += bar(sin(t+barsangle/6.*12.), 0.5, 0.0, 1.0);
	color += bar(sin(t+barsangle/6.*14.), 1.0, 0.0, 1.0);
	color.a = 1.0;
	gl_FragColor = color;
}