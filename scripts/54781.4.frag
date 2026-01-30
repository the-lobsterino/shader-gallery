#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float Pre;
uniform vec2 resolution;

void main( void ) 
{
	vec2 pos = (gl_FragCoord.xy / resolution.xy);
	
	float vv = pos.y*pos.y;
	vv+=sin(pos.x*3.14);
	

	
	float v = sin(sin(pos.x*15.0)*4.0+(vv) *50.0 + 8.0);
	v+=0.65;
	
	gl_FragColor = vec4( v*10.5, 0.25+.3*v, 0.5, 1.0 );
}