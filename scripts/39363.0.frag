#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float mouse = mouse.x;
	vec3 color1 = vec3(0.);
	vec3 color2 = vec3 (0.);
	vec2 st = vec2(gl_FragCoord.xy/resolution.xy);
	vec2 translate = vec2(tan(time),pow(time,1.3));
	
	st*=10.;
	st+=translate*0.35;
	st=fract(st);
	
	
	vec2 bl = step(vec2(0.6),st);       // bottom-left
   	vec2 tr = step(vec2(0.),1.-st);   // top-right
	color1=vec3(bl.x*bl.y*tr.x*tr.y);
	
	
	gl_FragColor= vec4(color1,1.);





}