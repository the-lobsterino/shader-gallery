#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec2 center = vec2(0., 0.0);
const float radius = 0.95;

float d(vec2 p)
{
	vec2 r = normalize(p - center);
	float a = (acos(dot(vec2(1.0, 0.0), r)) + 1.0) * 0.5;
	float s = sign(sin(a * 3.1 * 11.0));

	return max(length(p - center) - radius, -(length(p - center) - radius*0.5));// + s*0.1;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position =position *2.0-1.0;
	position.x *= resolution.x/resolution.y;
	float dist = d(position);
	vec2 m = mouse * 2.0 -1.0;
	m.x *= resolution.x/resolution.y;
	float msd = smoothstep(0.01, 0.0, abs(length(position-m)-d(m)));
	gl_FragColor = vec4( smoothstep(0.01, -0.01, abs(dist)), dist, msd, 1.0 );
}
