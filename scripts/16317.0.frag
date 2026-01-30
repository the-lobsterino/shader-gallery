#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 pos2 = position*vec2(1., resolution.y/resolution.x) - vec2(0.5, 0.25) + 0.2*vec2(sin(time*0.5), cos(time*0.5));
	vec2 color = vec2(0.);
	float posC = pos2.x*pos2.x + pos2.y*pos2.y;
	if (posC < 0.05) {
		color = vec2(position)*(0.05-posC)*10.;
	}
	
	float color2 = 0.;
	if (position.x > mouse.x-0.01 && position.x < mouse.x+0.01 && position.y > mouse.y-0.01 && position.y < mouse.y+0.01)
	   color2 = 0.5;
	
	gl_FragColor = vec4(color, color2, 1.);
}
