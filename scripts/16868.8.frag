#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 resolution;
uniform vec2 mouse;


float box(vec2 p, vec2 b, float r)
{
	return length(max(abs(p)-b,0.0))-r;
}


void main(void)
{
	float pulse = 0.9;
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float aspect = resolution.x / resolution.y;
	vec3 baseColor = vec3(0.0);
	vec3 light = vec3(0.0, 0.4, 1.0);
	vec3 color = vec3(0);
	
	uv.x *= aspect;
		
	vec2 size = vec2(0.1, 0.1);
	vec2 pos = vec2(0.5*aspect, 0.5);
	float b = box(uv-pos, size, 0.001);
	
	float dust = .85*smoothstep(0.05, 0.0, b);	
	float block = 0.1*smoothstep(0.001, 0.0, b);
	float shine = 1.0*pulse*smoothstep(-0.002, b, 0.037);
	
	color +=  dust + block + shine * light;
	
	gl_FragColor = vec4(color, 1.0);
}