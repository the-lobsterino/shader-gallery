#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 tc = gl_FragCoord.xy/ resolution.xy;
    vec2 p = -1.0 + 2.0 * tc;
    float len = length(p);
	vec2 uv = tc + (p/len)*cos(len*8.0-time*2.0)*0.008;
	gl_FragColor = vec4(vec3(0.2,0.2,0.2) + len / 2.5 - 0.3, 1.0);
}
