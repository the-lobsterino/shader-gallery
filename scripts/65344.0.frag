#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

#define BPM 116.0

vec2 rot (vec2 p, float r) {
	return vec2(
		cos(r) * p.x - sin(r) * p.y,
		cos(r) * p.y + sin(r) * p.x
	);
}

void main( void ) {
	float t = BPM * time / 60.0;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 p = gl_FragCoord.xy - resolution.xy / 2.0;
	p = rot(p, sin(t / 16.0 *  3.141592) * 3.141592);
	p = abs(p);
		

	float val = fract((p.x - t) / 64.0);
	val *= fract((p.y - t * 4.0 - abs(fract(t / 4.0) * 2.0 - 1.0) * 16.0) / 64.0);
	
	vec3 col = vec3( val, val * 0.5, sin( val + time / 3.0 ) * 0.75 );
	
	vec3 bb_col = texture2D(bb, position - 4.0 * sign(position - 0.5) / resolution.xy).rgb;
	
	col = mix(col, bb_col, 1.0 - length(col));
	

	gl_FragColor = vec4( col, 1.0 );

}