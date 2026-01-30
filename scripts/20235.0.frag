#ifdef GL_ES
precision mediump float; //g
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
	
	p = p + vec2(sin(time*2.5), cos(time))/20.0;

	float l = length(p - vec2(0.0, 0.0));
	float a = atan(p.y, p.x)*5.0 + time * 1.3;
	float s = 0.3 + 0.4*sin(a) + mouse.x;
	float c = 0.5 + 0.5*cos(a) + mouse.y/3.0;

	float c0 = smoothstep(0.2, 0.19, l-0.3*(c*c*c*c*c*c*(sin(time*0.6)+.8)/2.0 + s));
	gl_FragColor = vec4(vec3(c0), 1.0);
}