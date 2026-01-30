#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	gl_FragColor = vec4( vec3(0.,1.,0.5) * vec3(1.-step(1., p.x + p.y)) * step(0.2, p.x)* step(0.3, p.y), 1.0 );
}