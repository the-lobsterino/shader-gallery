// Based on Julia set
// If you increase the number of iterations
// in the loop you will get a fractal

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void )
{
	float mx = max( resolution.x, resolution.y );
	vec2 uv = 5.5*(gl_FragCoord.xy - 0.5*resolution.xy)/mx;
	float x, y;

	for(int n = 0; n < 3; ++n)
	{
		x = uv.x; y = uv.y;
		uv.x = x*x-y*y+0.6*cos(0.3*time);
		uv.y = x*y+0.6*sin(0.2*time);
	}

	gl_FragColor = vec4( uv.x, uv.y, uv.y/uv.x, 1.0 );
}