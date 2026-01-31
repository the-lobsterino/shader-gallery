#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) 
{
	vec2 pos = (gl_FragCoord.xy / resolution.xy);
	
	float v = sin(sin(pos.x*15.0)*4.0+(pos.y*pos.y) *50.0 + time * 2.0);
	v+=0.65;
	
	gl_FragColor = vec4( v*1.3, 0.6*v, v, 1.0 );
}
