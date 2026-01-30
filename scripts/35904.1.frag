#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float moon(vec2 uv, float phase){
	vec2 scent = vec2(phase* 2.0, 0.0);
	return (1.0 - smoothstep(0.98, 1.0, distance(uv, vec2(0.0)))) * (smoothstep(1.0, 1.1, distance(uv, scent)));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	position.x *= resolution.x / resolution.y;

	gl_FragColor = vec4( moon(position, mod(time * 0.01, 1.0) * 2.0 - 1.0));

}