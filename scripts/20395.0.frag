#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = position * 2.0 - 1.0;
	position.x *= resolution.x / resolution.y;

	float color = 0.0;
	float d = length(position);
	float pt  = mouse.x;
	float blurness = 0.2;
//	color = smoothstep(0.2, 0.3, d) - smoothstep(0.3, 0.4, d);
	color = smoothstep(pt + blurness * 2., pt + blurness * 3., d) - smoothstep(pt + blurness * 3., pt + blurness * 4., d);
	gl_FragColor = vec4( vec3( color, color, color), 1.0 );

}