#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 swr(vec3 p){
	vec3 col = vec3(p);
	vec3 c = col;
	for(int i=1; i<5; i++)	{
		float ii = float(i);
		col.xyz=(sin((col.zxy+col.yzx)*ii))*(sin((col.zxy*col.yzx)*ii));
		c=cos(p*ii+col*3.14);
		col = mix(c*c,col,sin(p.z)*0.49+0.5);
	}
	return col;
}
float Hash(vec2 p)
{
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float map(vec3 p)
{
	float k = 0.0;
	float m = 5.0;
	vec2 d = vec2(0.35 + sin(time), 0);
	k += Hash(floor(p.xz * m + d.xy));
	k += Hash(floor(p.xz * m - d.xy));
	k += Hash(floor(p.xz * m + d.yx));
	k += Hash(floor(p.xz * m - d.yx));
	k /= 4.5;
	return (cos(p.x * p.y) * cos(p.y)) + k;
}

vec2 rot(vec2 p, float a)
{
	return vec2(
		p.x * cos(a) - p.y * sin(a),
		p.x * sin(a) + p.y * cos(a));
}

void main( void ) {
	vec2 uv = 2.0 * ( gl_FragCoord.xy / resolution.xy ) - 1.0;
	uv.x *= resolution.x / resolution.y;
	uv.y = -uv.y;
	if(abs(uv.y) > .7) 
	{
		return;
	}
	vec3 dir = normalize(vec3(uv,1));
	float a = time * 0.1; 
	dir.xy = rot(dir.xy, a);
	dir = dir.zxy;
	dir.xy = rot(dir.xy, a);
	vec3 pos = vec3(0,0,time);
	float t = 0.0;
	for(int i = 0; i < 100; i++)
	{
		t += map(pos + dir * t) * 0.25;
	}
	vec3 ip = pos + dir * t;
	vec3 col = swr(ip)/t;
	gl_FragColor = vec4(col*(1.-(vec3(abs(0.05 * dir.xyzz) + vec4(t * 0.05) + map(ip + 0.05)))),1.0);
}