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
	
	float oscR = sin(sin(uv.x)*10.*PI+time*sin(uv.y*5.)*20.)*0.5+0.5;
	float oscG = sin(sin(uv.y)*15.*PI+time*sin(uv.y*5.)*20.)*0.5+0.5;
	float oscB = sin(sin(uv.y)*5.*PI+time*sin(uv.y*5.)*20.)*0.5+0.5;
	//float oscG = sin(sin(uv.y)*5.*PI+time*sin(uv.x*2.*PI))*0.5+0.5;
	//float oscB = sin(sin(uv.x)*20.*PI+0.2*time*sin(uv.y*4.)*2.)*0.5+0.5;
	
	
	gl_FragColor = vec4(oscR,oscG,oscB,1.0);

}