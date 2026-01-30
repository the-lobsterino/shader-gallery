#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main()
{
	float Center = distance(mouse * resolution, vec2(gl_FragCoord.x, gl_FragCoord.y));
	
	vec3 color = vec3(acos(1. - gl_FragCoord.xy * Center * .3 * pow(.1, 4.)), 0.);
	
	gl_FragColor = vec4(color, 1.);
}