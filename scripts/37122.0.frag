#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.1415926535

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 pos = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;

	vec3 color = vec3(0, 0, 0);
	
	for (float  i = 0.0; i < 20.0; ++i)
	{
		float p = i * PI * 2.0 / 20.0;
		vec2 p2 = pos + (0.1 + sin(atan(pos.y, pos.x) * 10.0 + time) * 0.02);
		color += vec3(1, 1, 1) * 0.004 / length(p2 + 0.2 * vec2(cos(time * 4.0 + p), sin(time * 4.0 + p)));
	}
	
	gl_FragColor = vec4(color , 1);

 }