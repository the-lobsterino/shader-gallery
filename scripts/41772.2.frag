#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;vec2 pos = vec2(2, 1);
	float color = resolution.x;
	
	color += sin(time * cos(0.2));
	
	for (int i = 0; i < 32; i++) { 
	     pos = vec2(sin(3.1419) * time, time / 2.0);
	}
	
	color += position.x * time / sin(time * cos(3.1419));
	color += sin(time * 0.2 + position.x - 3.0);
	
	gl_FragColor = vec4( color * 0.2, color * 0.5, color * 1.1,1 );

}