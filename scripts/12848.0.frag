// Shader attempt #1
// "Vaguely flowing water effect"
// by spatulasnout, 11dec13
// (rand() function borrowed from other shaders)

#ifdef GL_ES
precision mediump float;
#endif 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

float eps = 0.01;

float xs = 1. / resolution.x;
float ys = 1. / resolution.y;

#define K_SZ	8.
#define K_SZH	(K_SZ / 2.)
#define K_NUM	(K_SZ * K_SZ)
#define K_1NUM	(1. / K_NUM)

float rand (vec2 co)
{
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// sample and blend pixels from the backbuffer
// injecting some bright pixels at random time-skewed offsets
vec4 kernel (vec2 p)
{
	vec4 col;

	float tv = time / 256.;

	vec2 sp;
	sp.y = p.y - ((K_SZH * ys) + (ys * 0.75));  // the bonus xy offsets produce the flow direction
	for (int v = 0;  v < int(K_SZ);  ++v)
	{
		sp.x = p.x - ((K_SZH * xs) + (xs * 0.75));
		for (int u = 0;  u < int(K_SZ);  ++u)
		{
			float rnd = rand(vec2(sp.x + tv, sp.y + tv));
			vec4 bcol;
			if (rnd > 0.9)
			{
				float rnd2 = rand(vec2(p.x * cos(tv), p.y * sin(tv*3.)));  // rand(p * tv);
				if (int(mod(floor(rnd2 * 10000.), 2.)) == 1)
					bcol.b = 1.;
				else
					bcol.g = 1.;
				
				bcol *= (K_1NUM * 1.3);
			}
			else 
			{
				bcol = texture2D(bb, sp);
				bcol *= (K_1NUM * 1.0);
			}
			col += bcol;
			sp.x += xs;
		}
		sp.y += ys;
	}
	
	return col;
}


void main (void) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	vec4 col;

	if (abs(p.x - mouse.x) <= (xs * 16.)  &&  abs(p.y - mouse.y) <= (ys * 16.))
	{
		col.r = 1.;
		col.a = 0.01;
	}
	else
	{
		col = kernel(p);
	}
	
	gl_FragColor = vec4( col );
}