#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	//float color = 1.0;
	
	vec2 circle = position;
	float dist = distance(position,mouse);
	
	gl_FragColor = gl_FragColor+vec4(pow(dist*12.0,0.8),dist+cos(time+pow(dist,2.0030)),1.0,1.0); 


}