#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 sphere(vec2 p, float r)
{
	vec2 uv = gl_FragCoord.xy / resolution * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	if(distance(p, uv) <= r)
		return vec3(0.8, 0.9, 0.5);
	return vec3(0.2, 0.4, 0.3);
}

vec3 star(vec2 p, float r, vec3 cc)
{
	vec2 uv = gl_FragCoord.xy / resolution * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	vec3 col;
	
	if(distance(p, uv) > r)
		return vec3(1, 1, 1);
	col = vec3(1.0 / cc.x, 1.0 / cc.y, 1.0 / cc.z);
	col = vec3(abs(atan(uv)), abs(sin(uv.y + 1.5)) * 0.75);
	return col;
}

void main() 
{
	vec2 uv = gl_FragCoord.xy / resolution * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	vec3 color = vec3(0);
	
	color = sphere(vec2(0, 0), 0.8);
	color *= star(vec2(0, 0), 0.7, color);
	
	gl_FragColor = vec4(color, 1.0);

}