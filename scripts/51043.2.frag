#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = ( 2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
	vec3 dir = normalize(vec3(p.xy, -2.0 + length(p) * 0.15));

	float d = time * 0.3;
	mat3 rot = mat3(
		0.0, 1.0, 0.0,
		-sin(d), 0.0, cos(d),
		cos(d), 0.0, sin(d));
	rot*=rot*rot;
	rot*=rot;
	vec3 bendVector = rot * vec3(1.0, 0.0, 0.0);
	
//	vec2 c = tan(sin(time * vec2(1.0, 1.2) * 0.0) * 2.0 / 2.0);
	vec3 halfVector = normalize(vec3(0.0, 0.0, -1.0) + bendVector);
	vec2 c = halfVector.xy / halfVector.z;
	dir = mat3(
		1.0, 0.0, -c.x,
		0.0, 1.0, -c.y,
		c.x, c.y, 1.0
	) * dir;
	dir += vec3(c, 0.0);

	float z = dir.z / length(dir.xy);

	float a = atan(dir.y, dir.x);

	gl_FragColor = vec4(vec3(pow(fract(z - time) * fract(6.0 * a / 3.141592), 0.4)), 1.0);
}