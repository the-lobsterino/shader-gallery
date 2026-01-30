#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float crc(vec2 coord,vec2 pos,float d,float t)
{
	return float(mod((length(coord-pos)+t)*d,1.0)>0.5);
}
void main( void ) {

	vec2 position = ( (gl_FragCoord.xy-resolution.xy*0.5)/resolution.y );

	float color1 = crc(position,vec2(sin(time)*4.0,cos(time)*4.0),3.0,time*0.1);
	
	float color2 = crc(position,vec2(-sin(time*0.31)*4.0,cos(time*0.31)*4.0),3.0,-time*0.1);

	float color=mod(color1+color2,2.0);
	gl_FragColor = vec4( vec3( color), 1.0 );
}