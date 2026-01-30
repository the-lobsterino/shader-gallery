#ifdef GL_ES
precision mediump float;
#endif

// Example by Dorald

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 st = gl_FragCoord.xy/resolution;
    vec2 mos = mouse/resolution;

	gl_FragColor = vec4(mos.y,mos.x,abs(sin(time)),1.0);

}