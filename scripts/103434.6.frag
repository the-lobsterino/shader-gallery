#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
        float sinTime = sin(time);
	float scaledSinTime = ((sinTime) + 1.0) * 0.5;
	
	gl_FragColor = vec4(gl_FragCoord.xy, 0.0, 1.0);

}