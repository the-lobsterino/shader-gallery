#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


uniform sampler2D backbuffer;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec3 lastcolor = texture2D(backbuffer, position).xyz;

	float color = 0.02 / distance(position, mouse);
	
	vec3 o = vec3(0);
	o += lastcolor * 0.5;
	o += vec3(color) * vec3(0.8, 0.5, 0.8);
	o += 0.002 / (length((position - (vec2(.5) - (mouse - vec2(0.25)))))) * vec3(0.2, 0.4, 0.8);
	o += 0.001 / (length((position - mouse) * vec2(0.62, 13.0))) * vec3(02.2, 5.4, 30.8);

	gl_FragColor = vec4( o, 1.0 );

}