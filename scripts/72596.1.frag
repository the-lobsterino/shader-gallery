#ifdef GL_ES
precision mediump float;
#endif

// chessboard 
// todo : fix scale to square regardless aspect ratio

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float n){return fract(sin(n) * 43758.5453123);}

void main( void ) {
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec2 st = position * 10.0;
	st.x = st.x * 2.0;
	
	vec3 color = vec3(.941, .851, .71);
	
	if (mod(st.x, 2.0) <= 1.0 && mod(st.y, 2.0) > 1.0)
	{
		color = vec3 (.58, .435, .318);
	}
	if (mod(st.y, 2.0) <= 1.0 && mod(st.x, 2.0) > 1.0)
	{
		color = vec3 (.58, .435, .318);
	}
	
	if (st.x > 14.0){ color = vec3(st, rand(mouse.x * mouse.y)); }
	if (st.x < 6.0){ color = vec3(st, rand(mouse.x * mouse.y)); }
	if (st.y > 9.0){ color = vec3(st, rand(mouse.x * mouse.y)); }
	if (st.y < 1.0){ color = vec3(st, rand(mouse.x * mouse.y)); }
	
	gl_FragColor = vec4(color, 1.0);

}