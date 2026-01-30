#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy) + vec2(fract(time) * 2.0 - 1.0, 0.0);
	float v = 1.0 - distance(p, vec2(0.5, 0.5)) * 2.0;
    	gl_FragColor = vec4( 0.0, 0.0, v, 1.0 );
}