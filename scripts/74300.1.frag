#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec3 color = vec3(0.0, 0.0, 0.0);
	vec2 screenCurrent = vec2(gl_FragCoord.x/resolution.x, gl_FragCoord.y/resolution.y);
	if(screenCurrent.x>500.0) {
		color.x=1.0;
	}
	gl_FragColor = vec4(color, 1.0);

}