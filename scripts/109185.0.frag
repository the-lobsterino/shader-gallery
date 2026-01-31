#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{

	vec2 uv = (gl_FragCoord.xy / resolution.xy);
	//uv -= 0.5;
	//uv.x *= resolution.x/resolution.y;
	uv.x += time*.5;

	float tiles = 4.0;
	vec2 gv = fract(uv*tiles);
	gv -= 0.005;
	float gap = 0.025;
	float d = abs(gv.x)-gap;
	d = min(d, abs(gv.y)-gap);
	d = smoothstep(0.25,0.,d);
	gl_FragColor = vec4(vec3(d*.950), d);
}