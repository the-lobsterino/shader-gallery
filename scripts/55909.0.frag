#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dist(vec3 pos)
{
	pos.x += sin(time) * 2.0;
	pos.z += cos(time) * 2.0;
	return length(pos) - 1.0;
}

void main( void )
{
	vec2 uv = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y * 2.0;
	vec3 col = vec3(0.0);
	
	vec3 pos = vec3(0, 0, -5);
	vec3 dir = normalize(vec3(uv, 1.0));
	col = dir;
	
	for (int i = 0; i < 128; i++)
	{
		float d = dist(pos);
		if (d < 0.001)
		{
			col = vec3(1, 1, 1);
			break;
		}
		pos += dir * d;
	}
	gl_FragColor = vec4(col, 1);
}