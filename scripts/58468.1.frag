#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec2 p) {
	return length(p) - 0.2;
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	uv = 2.*uv-1.;
	uv.x *= resolution.x/resolution.y;
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec3 color = vec3(1.,0.,0.);
	color = mix(vec3(0.), vec3(1.), step(mouse.x, map(uv)));
	gl_FragColor = vec4( color, 1.0 );

}