#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main()
{
	vec2 coord = 2.0 * (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float r = sin(time) + 0.9;
	
	float g = cos(coord.x * coord.y + time * 10.0) + 0.1  * time;
	
	float b = tan(coord.x * coord.y + time * 10.0) + 0.9;
	
	gl_FragColor = vec4(r, g, b, 1.0);
}