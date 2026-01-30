// HelloWorld
// worley impl taken from Brandon Fogerty

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random( vec2 p )
{
	return fract( sin( fract( sin( p.x ) ) + p.y) * 42.17563);
}

float worley( vec2 p, float timeSpeed )
{
	float d = 10.0;
	for( int xo = -1; xo <= 1; xo++ )
	{
		for( int yo = -1; yo <= 1; yo++ )
			{
			vec2 test_cell = floor(p) + vec2( xo, yo );
			
			float f1 = random( test_cell );
			float f2 = random( test_cell + vec2(1.0,83.0) );
			
			float xp = mix( f1, f2, sin(f1*time*timeSpeed) );
			float yp = mix( f1, f2, cos(f2*time*timeSpeed) );
			
			vec2 c = test_cell + vec2(xp,yp);
			
			vec2 cTop = p - c;
			d = min( d, dot(cTop,cTop) );
		}
	}
	return d;
}

float pass( vec2 uv, float timeSpeed )
{
	float t = worley( gl_FragCoord.xy * 0.05, timeSpeed );
	t = pow(t, 2.0 );
	
	return t;
}

float mask( vec2 uv )
{
	float radius = fract(time * 0.4) * 7.0 - 1.0;
	float t = abs(radius - dot(uv, uv));
	t = (0.4 - t) * 2.0;
	t = clamp(t, 0.1, 1.0);
	t = pow(t, 3.0) * 2.0;
	t = t * (1.0 - clamp(radius * 0.2, 0.0, 1.0));
	return t;
}
void main( void )
{
	vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	
	float t = pass( uv, 6.0 );
	vec3 finalColor = vec3(pow(t, 2.0), t, sqrt(t * 1.0) );
	
	t = mask(uv*2.0);
	finalColor *= vec3(t * 4.0);
	
	gl_FragColor = vec4( finalColor, 1.0 );
}