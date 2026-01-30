precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;


vec2 mouseNorm = mouse * 2.0 - 1.0;
vec3 lightDir = normalize(vec3(mouseNorm, 1.0));

float dist_func(vec3 pos)
{
	return length(mod(pos,tan(time) + 5.0) - (1.0,1.0,0.7)) - 0.1;
}

vec3 getNormal(vec3 pos)
{
	float ep = 0.0001;
	return normalize(vec3(
			dist_func(pos) - dist_func(vec3(pos.x - ep, pos.y, pos.z)),
			dist_func(pos) - dist_func(vec3(pos.x, pos.y - ep, pos.z)),
			dist_func(pos) - dist_func(vec3(pos.x, pos.y, pos.z - ep))
		));
}

void main( void )
{
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	vec3 col = vec3(0.0);
	
	vec3 cameraPos = vec3(0.0, 0.0, 10.0);
	
	vec3 ray = normalize(vec3(pos, 0.0) - cameraPos);
	vec3 cur = cameraPos;
	
	for (int i = 0; i < 128; i++)
	{
		float d = dist_func(cur);
		if (d < 0.0001)
		{
			vec3 normal = getNormal(cur);
			float diff = dot(normal, lightDir);
			col = vec3(diff) + vec3(0.3);
			break;
		}
		cur += ray * d;
	}
	
	
	float p = gl_FragCoord.xy[0] / resolution.x;
	float q = gl_FragCoord.xy[1] / resolution.y;
	vec3 color = vec3(p, q, sin(time));
	
	for (int j = 0; j < 3; j++)
	{
	col[j] = col[j] * color[j];
	}
	
	
	gl_FragColor = vec4(col, 1.0);
}