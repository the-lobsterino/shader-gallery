#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	float mask = length(p*7.7);
	mask=smoothstep(0.1,0.8,mask);
	p.y/=length(p*0.012)*sin(p.y*1.4);
	float circle = sin(p.y*1.+time*5.);
	circle*=mask;
	gl_FragColor = vec4(vec3( circle)*vec3(1.1,0.8,0.1), 1.0);

}
