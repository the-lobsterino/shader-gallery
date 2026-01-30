#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

//Salut papa!

//Salut papa!

//Salut papa!

uniform float time;
uniform vec2 resolution;

float hsin ( float b )
{
	return 0.9*sin(time*b)+0.9;
}

void main( void )
{
	float warp = 1.0; //2.0*sin(time)+3.0;
	float scale = 0.5;
	vec2 uvOffset = gl_FragCoord.xy/resolution.xy/2.0;

	vec2 p = 2.0 * (gl_FragCoord.xy * scale / resolution.xy + uvOffset - vec2(0.5, 0.5)) * resolution / resolution.y;
	vec2 z = vec2(0.0);
	vec2 dz = vec2(0.0);
	
	bool black = false;
	
	for(int i = 0; i < 512; i++)
	{
		if( length(z) >1024.0 ) 
		{	
			bool black = false;
			continue;
		}
		else 
		{
			bool black = true;
		}
		dz = 2.0 * vec2(z.x * dz.x - z.y * dz.y, z.x * dz.y + z.y * dz.x) + vec2(1.0, 0.0);
		z = vec2(z.x * z.x * warp - z.y * z.y * warp, 2.0 * z.x * z.y) + p;
	}

	float r = length(z);
	float dr = length(dz);
	float de = 0.5 * log(r) * r / dr;
	de = clamp( 8.0*de, 0.0, 1.0 );
  	de = pow( de, 0.1);
	vec3 col = vec3( de+hsin(0.2), de*hsin(0.7), de*hsin(1.2));
	gl_FragColor = vec4(col,1.0);
}