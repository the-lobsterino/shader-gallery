#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define T (time * 1.5+length(uv)*4.)
#define W 0.01
#define X (0.1 + sin(T * 0.25) * 0.1)
#define Y (0.04 * sin(T))

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	
	// uv = mod(uv - 0.5, Y) + 0.5;
	
	for(int i=0;i<8;i++)
	{
		color -= step(uv.y + W, uv.x);
		color += step(uv.y - W, uv.x);
		color *= step(X, uv.x) * step(uv.x, 1.0 - X);
		uv.y += Y;
		uv.x = 1.0 - uv.x;
		color -= step(uv.y + W, uv.x);
		color += step(uv.y - W, uv.x);
		color *= step(X, uv.x) * step(uv.x, 1.0 - X);
		
	}
	
	
	gl_FragColor = vec4( color);

}