#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 iter(vec2 init, float a, float b, float c, float d) {
	return vec2(sin(a*init.y)*cos(b*init.x), sin(c*init.x) - cos(d*init.y));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 1.0;
	
	float diff = 0.0;
	vec2 new;
	for (int i = 0; i < 100; i++) {
		//new = iter(position, -2.0+sin(1.1+time+3.14/2.0)+mouse.x, 2.0+sin(3.1+time)+mouse.y, 2.0+cos(1.1-time+3.14/2.0), 2.0+cos(1.0+time));
		new = iter(position, -.9, 10.0*sin(mouse.x), 50.0*cos(mouse.y), -1.0*cos(mouse.x));
		diff += length(new - position);
		position = new;
	}

	gl_FragColor = vec4( vec3(diff/20.0), 1.0 );

}