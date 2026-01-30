#ifdef GL_ES
precision mediump float;
#endif

//metaballsacks
//infinitysnapz 10th nov 20

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
float PI = 3.1415926538;

void main( void ) {
	
	vec2 position = (( gl_FragCoord.xy / resolution.x ));
	vec2 pos = vec2(position.x, (position.y + (resolution.y/resolution.x)/2.0));
	vec2 b1 = (vec2( sin(time)/2.0, cos(time*2.0)/2.0 )+0.5);
	vec2 b2 = (vec2( sin(time*1.53)/2.0, cos(time*1.212)/2.0 )+0.5);

	float color = 0.0;
	color += float((1.0/( pow(pos.x-b1.x,2.0)+pow(pos.y-b1.y,2.0))) + (1.0/( pow(pos.x-b2.x,2.0)+pow(pos.y-b2.y,2.0)) )>30.0);


	gl_FragColor = vec4( color, color, color, 1 );

}