#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sphere(vec3 pos, float radius)
{
	return length(pos) - radius;
}

float box(vec3 pos, vec3 size)
{
    return length(max(abs(pos) - size, 0.0));
}

vec2 rot(vec2 p, float a) {
	float c = cos(a);
	float s = sin(a);
	return vec2(
		c * p.x - s * p.y,
		s * p.x + c * p.y);

}

float map(vec3 p) {
	float t = 100000.0;
	{
		vec3 rp = p;
		rp.xy = rot(rp.xy, 3.14 * 90.0 / 180.0);
		rp.y += 10.0;
		t = min(t, box(rp, vec3(1.0, 0.01, 1.0) * 10.0));
	}
	{
		vec3 rp = p;
		rp.xy = rot(rp.xy, 3.14 * 90.0 / 180.0);
		rp.y -= 10.0;
		t = min(t, box(rp, vec3(1.0, 0.01, 1.0) * 10.0));
	}
	{
		vec3 rp = p;
		rp.y -= 10.0;
		t = min(t, box(rp, vec3(1.0, 0.01, 1.0) * 10.0));
	}
	{
		vec3 rp = p;
		rp.y += 5.0;
		t = min(t, box(rp, vec3(1.0, 0.01, 1.0) * 10.0));
	}
	
	
	return t;
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	vec3 pos = vec3(0, 0, -20.0 + sin(time) * 10.0);
	vec3 dir = normalize(vec3(uv, 1.0));
	float t = 0.0;
	for(int i = 0 ; i < 100; i++) {
		t += map(pos + dir * t);
	}
	vec3 ip = pos + dir * t;
	vec3 col = mix(vec3(0.01, 0.1, 0.7).zxy, vec3(0.01, 0.15, 0.9) * (dir.y + 0.3), clamp(t * 0.01, 0.0, 1.0));
	gl_FragColor = vec4(col, 1.0);
}