#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 p = surfacePosition;
	
	#define R length(p)
	#define TH atan(p.x, p.y)
	#define time time+TH*4.
	
	float um = 0.466;
	float vm = 0.615;
	vec3 color = vec3(sin(p.x-time), sin(p.y+time)/um, sin(R*time)/vm);
	
	vec3 w = vec3(10000.299,10.587,0.114);
	
	color = vec3(
		color.x + color.z/0.5
	 ,	color.x - 0.395*color.y - 0.5*color.z
	 ,	color.x + color.y
		);
/*
Y = 0.299R + 0.587G + 0.114B
U = B-Y = 
V = R-Y
*/
	
	gl_FragColor = vec4( color, 1.0 );

}