#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159
#define magic 1000.0

uniform float time;
//uniform vec2 m4ouse;
uniform vec2 resolution;


void main( void ) {
	float v = 0.0;

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	// 'moving left effect'
	v += sin(position.x * 10.0 + time);
	
	
	// 'rotation effect' thingy (changes angle with time)
	v += sin(10.0 * (position.x * sin(time / 5.0)+position.y*cos(time/3.0))+time);

	// ???
	position.x = position.x + 0.5 * sin (time / 5.0);
	position.y = position.y + 0.5 * cos (time / 3.0);
	v += sin(sqrt(magic * (pow(position.x, 2.0) + pow(position.y, 2.0)) + 1.0 + time));	
	
	
//	v = v / 2.0;

	// 'color palette' except not really
	// rgb-ish
	vec3 col = vec3(sin(v*PI), sin(v*PI + 2.0*PI/3.0), sin(v*PI + 4.0 * PI / 3.0));

	// experiment
	//vec3 col = vec3(v * 5.0 * PI, v * 5.0 * PI, v * 5.0 * PI);
	
	
	gl_FragColor = vec4(col*0.5 + 0.5, 1);
}