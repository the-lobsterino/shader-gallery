// Julia fractal by @Srv
// Just ported code from @iq live session coding

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

void main( void ) {

	vec2 p = -0.5 + gl_FragCoord.xy/resolution.xy;

	vec2 z = p * 1.5;
	vec2 c = vec2(-0.745, 0.19);
	c.x = surfacePosition.x;
	c.y = surfacePosition.y;
	float t = 0.0;
	
	for (int i=0; i<1000; i++)
	{
		vec2 nz = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
		float m2 = dot(nz, nz);		
		if (m2 > 4.0) break;		
		z = nz;				
		t += 1.0/63.0;
	}
	
	float r = 1.0 * cos(t+1.25);
	float g = 1.0 * sin(t*2.40);
	float b = 1.0 * cos(t-0.95);
	
	vec3 col = vec3(r, g, b);

	gl_FragColor = vec4(col, 1.0 );

}