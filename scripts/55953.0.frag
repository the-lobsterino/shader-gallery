#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy*2.0-resolution)/min(resolution.x,resolution.y);
	vec2 q;
	q.x=p.x+cos(time);
	q.y=q.y+sin(time);
	float f = 0.05/length(q);
	gl_FragColor=vec4(f,f,f,1.0);
}