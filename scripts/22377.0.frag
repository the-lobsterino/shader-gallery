#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float plot(vec2 p, float f)
{
	return 0.001 / length(p.y - f);
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy) - vec2(0.5);

	float f = p.x;
	float c = plot(p, f);

	gl_FragColor = vec4(c);
}