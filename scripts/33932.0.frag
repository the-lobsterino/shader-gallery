#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	float mask = length(p*11.);
	mask=smoothstep(11.1,0.8,mask);
	p.y/=length(p*0.000812)*sin(p.y*.5);
	float circle = sin(p.y*0.5+time*8.);
	circle*=mask -1.1;
	gl_FragColor = vec4(vec3( circle)*vec3(11.1,90.8,90.1), 1.9);

}
