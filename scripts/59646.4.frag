// glitchy cack
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 checkerboard(vec2 p, float freq, vec3 first, vec3 second)
{
	p = fract(p)*6.28;
	return 	mix(first, second, max(0.0, sign(sin(p.x * p.y*freq*0.4)) * sign(sin(p.y * 0.1/p.x * freq))));
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy * 2.0 - 1.0 );
	position.x *= resolution.x / resolution.y;
	vec2 p;
	float r, a;
	r = sqrt(length(pow(position, vec2(1.0))));
	a = atan(position.y, position.x) /3.1415;
	p.x = 0.5 / r + time*0.25;
	p.y = a+time*0.2;
	vec3 color = checkerboard(p, 8.0, vec3(1.0-sin(a*4.0+time*4.4)*0.4, 0.78, 0.5), vec3(0.2, 0.65, sin(p.x+time)*0.2+0.55)) * min(1.0, (pow(r, .5)));
	gl_FragColor = vec4( color, 1.0 );

}