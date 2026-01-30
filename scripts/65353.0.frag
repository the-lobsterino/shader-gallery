// 100620N
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec2 uv = gl_FragCoord.xy / resolution;
	
	float forma = sin(uv.y+time*.1*
			 sin(uv.y+time*.1+0.3*
			    sin(uv.x+time*.1+0.2*
			       exp(uv.x+time*.01*
				  sin(uv.x+time*0.1*
				     sin(uv.y+time*.1))))))*0.5+0.5;
	vec3 col1 = vec3(0.3,0.1,0.4);
	vec3 col2 = vec3(0.7,0.9,0.6);
	
	vec3 mixColor = col1*forma + col2*forma;
	gl_FragColor = vec4( mixColor, 1.0 );

}