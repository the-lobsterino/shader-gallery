#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = -1.0 + 2.0*(gl_FragCoord.xy / resolution.xy);
	p.x *= p.y = 1.0/p.y;
	float z = -time*16.0;
	vec3 sky = mix(vec3(0.1, 0.5, 1.4), vec3(1.0,0.4,0.2), 0.5-1.0/abs(p.y));
	vec3 ground = mix(sky * (floor(sin(16.0*p.y+z)*sin(p.x*16.0))+1.0), sky*0.5, 1.0-1.0/p.y);
	gl_FragColor = vec4(mix(ground, sky, step(-p.y, 0.0)), 1.0);
}