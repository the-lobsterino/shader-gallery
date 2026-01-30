#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 position;


void main()
{
	vec2 p = gl_FragCoord.xy;
	
	vec2 mid = resolution.xy / 2.;
	vec2 pos = position.xy / 2.;
	vec2 mos = mouse * 200.0;
	
	float x = length(mid - mos);
	float test = length(p - mid);

	
	float r = sin(p.x * (test / x));
	float g = cos(p.y * (test / x));
	
	gl_FragColor = vec4(r*g, r*g, r*g, 1);
}