#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	return 3.0 - length(p.xy);
}

vec2 rot(vec2 p, float a) {
	return vec2(
		p.x * cos(a) - p.y * sin(a),
		p.x * sin(a) + p.y * cos(a));
		
}

void main( void ) {

	vec2 uv = ( 32.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 dir = normalize(vec3(uv, 1.0));
	vec3 pos = vec3(0, 0, time);
	dir.zy = rot(dir.zy, -1.2);
	dir.xz = rot(dir.xz, time * 0.2);
	float t = 0.0;
	vec3 col = vec3(0.0);
	for(int i = 0 ; i < 100; i++) 
	{
		t += map(dir * t + pos);
	}
	vec3 ip = dir * t + pos;
	col.x = smoothstep(0.25, 0.5, mod(ip.x, 1.0));
	col.y = smoothstep(0.25, 0.5, mod(ip.x, 1.0));
	col.z = smoothstep(0.25, 0.5, mod(ip.z, 1.0));
	col += vec3(t) * 0.1;
	gl_FragColor = vec4(col, 1.0);

}