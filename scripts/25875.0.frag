#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;
//useful little function by MrOMGWTF
vec3 checkerboard(vec2 p, float freq, vec3 first, vec3 second)
{
	return 	mix(first, second, max(0.0, sign(sin(p.x * 6.283*freq)) * sign(sin(p.y * 6.283 * freq))));
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy * 2.0 - 1.0 );
	position.x *= resolution.x / resolution.y;
	position.y += sin(time)*0.35;
	position.x += cos(time)*0.1;
	vec2 p;
	float r, a;
	r = sqrt(length(pow(position, vec2(0.5))));
	a = atan(position.y, position.x) / 3.1415;
	p.x = 0.5 / r + time*0.5;
	p.y = a+time*0.2;
	vec3 color = checkerboard(p, 8.0, vec3(0.0, 0.7, 0.75), vec3(0.8, 0.5, 0.25)) * min(1.0, (pow(r, 2.5)));
	gl_FragColor = vec4( mix(color, texture2D(bb, gl_FragCoord.xy / resolution.xy).rgb, 0.4), 1.0 );

}