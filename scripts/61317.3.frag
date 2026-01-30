#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 rel = ( gl_FragCoord.xy * sin(time * .5) * .01 / resolution.xy);
	
	float mask = 0.0;
	//mask += mod (time, rel.x - 50. * 0.005);
	mask += (mod (time, rel.y - 50. * 0.005));

  	gl_FragColor = vec4( (mask-1. * -1.), mask , 0.5 , 1);
}