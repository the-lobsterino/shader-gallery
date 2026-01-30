#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 pos, float size)
{
	return length(pos) - size;
}

float udRoundBox( vec3 p, vec3 b, float r )
{
	return length(max(abs(p)-b,0.0)) - r;
}

float dist(vec3 pos)
{
	return udRoundBox(pos, vec3(4, 4, 4), 0.5);
}

void main( void ) 
{
	vec2 tex = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;
	
	vec3 color = vec3(0, 0, 0);
	
	vec3 pos = vec3(0, 0, -10);
	vec3 dir = normalize(vec3(tex, 0.3));
	
	for (int i = 0; i < 64; ++i)
	{
		float d = dist(pos);
		if (d < 0.001) color = vec3(1, 1, 1);
		
		pos += dir * d;
	}

	gl_FragColor = vec4(color, 1.0);

}