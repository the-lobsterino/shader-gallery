#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	float color = clamp(rand(gl_FragCoord.xy + time), 0.1,0.5);
	gl_FragColor = vec4( color, color, color, 1.0 );
}