#ifdef GL_ES
precision mediump float;
#endif

#define It 4

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec4 color = vec4 (1.0,.2,.1,1.0);
float scale = time*tan(3.14);
float amp = 0.2;
float speed = -1.0;

void main( void ) {

	vec2 xpos = (gl_FragCoord.xy/resolution.xy)-0.5;
	vec2 ypos = (gl_FragCoord.yx/resolution.xy)-0.9;
	
	float xline = amp*sin(scale*xpos.x-speed*time);
	float xtline = 30.0 * abs(xpos.y - xline);
		
	float yline = amp*cos(scale*ypos.x-speed*time);
	float ytline = 30.0 * abs (ypos.y - yline);
	
	gl_FragColor= (xtline*color*ytline);
}