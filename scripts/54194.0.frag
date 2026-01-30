#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

#define PI 3.14159

void main()
{
	float scale = 8.0;

	vec2 g = gl_FragCoord.xy;
	g = ceil(g / scale) * scale;
	float v = 0.0;
	vec2 c = g.xy / resolution.xy + resolution.xy/2.0;
	v += sin((c.x*10.0+time));
	v += sin((c.y*10.0+time)/2.0);
	v += sin((c.x*10.0+c.y*10.0+time)/2.0);
	float cx = c.x+.5*sin(time/5.);
	float cy = c.y+.5*cos(time/3.);
	vec3 col = vec3(0.5*(.5+.5*sin(PI*v+2.0*time/5.0)), 0.5*(.5+.5*sin(PI*v)), 0.5*(.5+.5*sin(PI*v+4.0*time/2.5)));
	gl_FragColor=vec4(col, 1);
}
