#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float b;

void main( void ) {
	
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); // 正規化 -1.0〜1.0

	float x = uv.x * 10.0;
	float y = uv.y * 10.0;
	
	float v = mod(floor(x),2.0);
	v = v == 0.0 ? -1.0 : v ;
	b = mod(floor(x) + floor(y + time * v), 2.0);
	
	gl_FragColor = vec4( vec3( 1.0,1.0,b ), 1.0 );

}