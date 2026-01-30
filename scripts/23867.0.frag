#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) 
{
	float  t = length(mod(p.xz, 2.0) - 1.0) - 0.97;
	t = max(-t, 3.0 - dot(p, vec3(0, 1, 0)) + (sin(p.x * 0.3) * sin(p.z * 0.6)));
	t = min(t, length(mod(p.xz, 10.0) - 5.0) - 0.2);
	t = min(t, length(mod(p.xy, 10.0) - 5.0) - 0.2);
	t = min(t, length(mod(p.yz, 10.0) - 5.0) - 0.2);
	return t;
}

vec2 rot(vec2 p, float t)
{
	return vec2(
		cos(t) * p.x - sin(t) * p.y,
		sin(t) * p.x + cos(t) * p.y);
		
}
void main( void ) 
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x   *= resolution.x / resolution.y;
	uv.y    = -uv.y;
	if(abs(uv.y) > 0.75) discard;
	
	vec3 dir = normalize(vec3(uv, 1));
	//dir.xz = rot(dir.xz, time * 0.1);
	//dir.yx = rot(dir.yx, time * 0.1);
	vec3 pos = vec3(sin(time * 90.0) * 0.01, cos(time * 15.0) * 0.2, time);
	float t = fract(dot(sin(time * 2465.0) * 5.17878, sin(time * 1.0)));
	for(int i = 0 ; i < 100; i++) 
	{
		float temp = map(pos + dir * t) * 0.75;
		if(temp <  0.01) break;
		t += temp;
	}
	vec3 ip = pos + dir * t;
	gl_FragColor = vec4(t * 0.04) * map(ip - 0.2) + t * 0.015;
	gl_FragColor.a = 1.0;
}