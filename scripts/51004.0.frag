#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec4 cursor_color = vec4(0.0, 0.0, 0.0, 1.0);
	vec4 background_color = vec4(0.3, 0.3, 1.0, 1.0);

	vec2 p = (2.0 * gl_FragCoord.xy) / min(resolution.x, resolution.y);
	vec2 m = mouse*2.0+0.1*vec2(cos(time*15.0),sin(time*10.0+1.0));
	float distToMouse = distance(p,m);
	distToMouse = mod(distToMouse,0.2*abs(cos(time*2.0))+0.1);
	
	gl_FragColor = mix(cursor_color,background_color,distToMouse);
}