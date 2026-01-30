#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 tex(vec2 uv ) {

	vec2 position = uv;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	return vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 duv = vec2(0.01, 0.0);
	vec4 col = vec4(0.0);
	col = vec4( (tex(uv) - tex(uv + duv.xy)).xy, 1.0, 1.0);
	col = vec4( (tex(uv) - tex(uv.yx + duv.yx)).xy, 1.0, 1.0);
	gl_FragColor = col;
}