#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec4 color = vec4(1.0,1.0,1.0,1.0);

	if(position.y-sin(time*0.01*position.x)*sin(time-position.x)*0.2< 0.5+sin(time*1.0*sin(position.y*time*0.05)*position.x+time)*0.1)
	   color = vec4(0.0,0.0,0.2+sin(position.y*position.x*abs(sin(time))),1.0);
	
	gl_FragColor = color;
}