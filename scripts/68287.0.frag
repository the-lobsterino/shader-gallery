// N091020N simplified
// N091020N slowed down

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define t time*0.1
const float PI = 3.1415926535;
void main( void ) {
	
	vec2 p = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0;	
	vec3 col = vec3(0.,0.,0.);
	col.r += 1. - distance(p.y, 0.5*cos(sin(t)*2.0*PI*p.x));
	col.r += smoothstep(.599,.999,col.r);
	
	col.g += 1. - distance(p.y, 0.5*cos(cos(t+col.r)*2.0*PI*p.x));
	col.g += smoothstep(.599,.999,col.g);

	col.b += 1. - distance(p.y, 0.5*cos(sin(t)*2.0*PI*p.x*col.g));
	col.b += smoothstep(.599,.999,col.b);

	gl_FragColor = vec4( col, 1.0 );

}