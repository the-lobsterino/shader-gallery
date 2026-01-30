#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (gl_FragCoord.xy / resolution.xy)-mouse.xy;

	float stime = time * 7.5;
	
	vec3 color = vec3(1.0);
	float mult = 0.8*abs(sin(stime))+.5;
	color *= sin(sin(time)*10.0+1.0/position.x*mult);
	color *= cos(cos(time)*10.0+1.0/position.y*mult);
	
	color.r *= cos(stime/2.);
	color.b *= sin(stime/2.);
	color.g *= tan(stime/2.);
	
	color -= sin(stime)*distance(mouse.xy, gl_FragCoord.xy/resolution.xy);
	
	gl_FragColor = vec4(color, 1.0);

}