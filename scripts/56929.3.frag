#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 position = gl_FragCoord.xy / resolution.xy;
	
	float range = 1.0/resolution.y;
	
	float swing = sin(time*(gl_FragCoord.x/100.0))/2.0+0.5;
	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	
	if (swing+range > position.y && swing-range < position.y) {
		r = 1.0;
		g = 1.0;
		b = 1.0;
	}
	
	vec3 color = vec3(r, g, b);

	gl_FragColor = vec4(color, 1.0);

}