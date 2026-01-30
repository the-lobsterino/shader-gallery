#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rotate(vec3 vec, vec3 axis, float ang)
{
	return vec * cos(ang) + cross(axis, vec) * sin(ang) + axis * dot(axis, vec) * (1.0 - cos(ang));
}
void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution - vec2(0.5);
	pos.x *= resolution.x / resolution.y;
	vec2 p = rotate(vec3(pos, 0.0), vec3(0.0, 0.0, 1.0), time).xy;
	float r = sqrt(dot(p, p));
	float t = 0.3;
	gl_FragColor = vec4(vec3(r < t && p.x > 0.0 ? 1.0 : 0.0), 1.0);
}