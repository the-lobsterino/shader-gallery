#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	

	float color = fract((abs(dot(gl_FragCoord.xy ,vec2(sin(time * 0.2898),cos(time*.90))))) *( 09.9/time));
	
	gl_FragColor = vec4(vec3(color),1.0);

}