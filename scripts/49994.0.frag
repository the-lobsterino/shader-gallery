#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5);
	
        //float angle = atan(position.y, position.x);*-sin(angle)
	float color = 0.02/((0.3-length(position)));
	if(position.y > 0.0) color = 0.0;
	color = max(color-0.2, 0.0);

	gl_FragColor = vec4( vec3( color, color , color ), 1.0 );

}