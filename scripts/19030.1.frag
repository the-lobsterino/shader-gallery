#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(in vec3 p)
{
	// sphere
	vec3 o = vec3(0.0, 0.0, 3.0);
	return length(p - o) - 1.0 + sin(time * 0.1) * 0.01 + cos(time * 0.1) * 0.01;
}

float raymarsh(in vec3 ro, in vec3 rd)
{
	float t = 0.0;
	for (int i = 0; i < 32; i++)
	{
		if(t > 10.0) break;
		
		float d = map(ro + rd * t);	
		if (d < 0.02)
		{
			return t;
		}
		
		t += d;
	}
	return 0.0;
}

void main( void ) {

	vec2 position = vec2(2.0, 1.0) * gl_FragCoord.xy / resolution.xy - vec2(1.0, 0.5);
	vec3 col = vec3(0.0, 1.0, 1.0);
	
	// Camera
	vec3 ro = vec3(0, 0, 0);
	vec3 rd = normalize(vec3(position.xy, 1.0));

	float t = raymarsh(ro, rd);
	if(t > 0.0)
	{
		col = vec3(t, t, t);
	}

	gl_FragColor = vec4(col, 1.0);
}