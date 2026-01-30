#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dist(vec3 pos) 
{
	return length(pos);
}

void main( void ) {

	vec2 uv = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;
	
	vec3 pos = vec3(0.0, 0.0, 0.0);
	vec3 dir = normalize(vec3(uv, 1.0));
	
	for (int i = 0; i < 10; ++i)
	{
		float d = dist(pos);
		pos += dir;
	}
	
	vec3 color = dir;
	

	gl_FragColor = vec4(color, 1.0);
}