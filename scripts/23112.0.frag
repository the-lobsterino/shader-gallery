#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy);
	vec2 v_TexCoordinate = p;

	vec2 center = vec2(0.5);
	float radius = 0.5;
	float is_inside = step(length(v_TexCoordinate - center), radius);
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * is_inside;
}