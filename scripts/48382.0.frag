#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float scale = resolution.y / resolution.x;
	uv=((uv-0.5)*5.5);
	uv.y*=scale;
	uv.x-=0.5;
	vec2 z = vec2(0.0, 0.0);
	vec3 col = vec3(0.0, 0.0, 0.0);
	float v;
 
	for(int i=0;(i<10);i++)
	{
		z = vec2(z.x*z.x - z.y*z.y, 2.0*z.y*z.x) + uv;
		if((z.x*z.x+z.y*z.y+2.0*sin(time)) >= 2.0)
		{
			col = vec3(1,1,1);
			break;
		}
 
	}
 	gl_FragColor = vec4(col,1.0);
}