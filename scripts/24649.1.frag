#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = mod(gl_FragCoord.xy, vec2(30.0)) - vec2(15.0);
        float dist_squared = dot(pos, pos);
        gl_FragColor = (dist_squared < 200.0) ? vec4(0.9, 0.9, 0.9, 1.0) : vec4(0.2, 0.1, 0.4, 1.0);
}