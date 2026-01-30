#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 color1 = vec3(1.0, 0.0, 0.0);
const vec3 color2 = vec3(1.0, 1.0, 1.0);

void main( void ) {

	vec2 position = gl_FragCoord.xy * 1.0;
	
	// float value = cos(position.x*(1.0-time/2.0)-position.y*sin(time));
	// float value = cos(position.x-position.y*sin(time*0.2)); 
	float value = cos(0.1*(position.x*time-position.y*position.x));
	value += 1.0;
	value /= 2.0;
	
	gl_FragColor = vec4(mix(color1, color2, value), 1.0);

}