#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution.xy - vec2(0.5);
	pos *= resolution.xy / min(resolution.x, resolution.y) * 2.;
	
	float tx = time * 0.4;
	mat3 rx = mat3(
		1, 0, 0,
		0, cos(tx), sin(tx),
		0, -sin(tx), cos(tx)
	);
	
	float ty = time * 0.5;
	mat3 ry = mat3(
		cos(ty), 0, sin(ty),
		0, 1, 0,
		-sin(ty), 0, cos(ty)
	);
	
	float tz = time * 0.1;
	mat3 rz = mat3(
		cos(tz), sin(tz), 0,
		-sin(tz), cos(tz), 0,
		0, 0, 1
	);
	
	vec3 p3 = rz * ry * rx * vec3(pos, 0.0);
	
	p3 = abs(p3);
	float gray = max(p3.x, max(p3.y, p3.z));
	
	gray = -(gray - 0.5) * 10000.;
	
	vec3 color = vec3(gray);
	gl_FragColor = vec4(color, 1);
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
}