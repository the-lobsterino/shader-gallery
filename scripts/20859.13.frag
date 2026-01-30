#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;


float cabs (const vec2 c) { return dot(c,c); }

vec2 cconj(const vec2 c) { return vec2(c.x, -c.y); }


vec2 cmul(const vec2 c1, const vec2 c2)
{
	return vec2(
		c1.x * c2.x - c1.y * c2.y,
		c1.x * c2.y + c1.y * c2.x
	);
}

vec2 cdiv(const vec2 c1, const vec2 c2)
{
	return cmul(c1, cconj(c2)) / dot(c2, c2);
}


vec2 rotate(vec2 point, float rads) {
	float cs = cos(rads);
	float sn = sin(rads);
	return point * mat2(cs, -sn, sn, cs);
}	

vec2 d1(vec2 z) {
	return cdiv(cmul(vec2(4.0,4.0),z),vec2(8,0.0));
}

vec2 d2(vec2 z) {
	return (vec2(1.0, 0.0) - cdiv(cmul(vec2(4.0,-4.0),z),vec2(8,0.0)));
}
float random(vec2 v) 
{
return fract(sin(dot(v /resolution,vec2(12.9898,78.233))) * (100.0+time*0.05));
}
void main(void)
{
	vec2 uv = gl_FragCoord.xy / resolution;
	vec4 old = texture2D(backbuffer, uv);
	if (mod(time, 0.2) > 0.06) {
		gl_FragColor = old;
	} else {
		float m = 0.0;
		if (mod(time, 14.0) < (1.0/20.0)) { m = 1.0; }
		vec2 z = mix(old.xz, uv * 1000.0, m);

		if (random(gl_FragCoord.xy) < 0.50001) {
			z = d1(z);
		} else {
			z = d2(z);
		}
		gl_FragColor = vec4(z.x, 0.0, z.y, 1.0);
	}
}