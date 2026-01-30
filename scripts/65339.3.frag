#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359


void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec2 uv = gl_FragCoord.xy / resolution;
	vec3 col1 = vec3(168./255.,255./255.,120./255.);
	vec3 col2 = vec3(120./255.,255./255.,214./255.);
	float forma = sin(uv.x*1.*PI+time+sin(uv.y*5.*tan(mouse.y)+time))*0.5+0.5;
	
	
	
	
	vec3 colorF = vec3(cos(forma*5.*mouse.x+time*sin(forma))*0.5+0.5);
	vec3 mixColor = (colorF*col1) * (2.*colorF*col2);
	
	gl_FragColor= vec4(mixColor,1);

}