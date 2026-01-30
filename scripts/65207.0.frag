#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv  = uv * 2.0 - 1.0;
	vec2 c = vec2(0.0, 0.0);
	float dis = length(uv - c);
	
	float col = dot(vec2(1.0, 0.0), uv);
	col =fract(col + time);
	col = (pow(col, 2.0) + pow(1.0 - col, 8.0)) * 0.5;
	gl_FragColor = vec4( vec3(col), 1.0 );

}