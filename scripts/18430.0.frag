/*
  Daily an hour GLSL sketch by @chimanaco 2/30

  References:
  http://www.demoscene.jp/?p=1147
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

float rings(vec2 p)
{
  float time = time  + length(p) * length(p) * length(p);
  return sin(time* 12.);
}



// 2D random numbers
vec2 rand2(in vec2 p)
{
	return fract(vec2(sin(p.x * 591.32 + p.y * 154.077 + time), cos(p.x * 391.32 + p.y * 49.077 + time)));
}

float voronoi(in vec2 x)
{
	vec2 p = floor(x);
	vec2 f = fract(x);
	
	vec2 res = vec2(8.0);
	for(int j = -1; j <= 1; j ++)
	{
		for(int i = -1; i <= 1; i ++)
		{
			vec2 b = vec2(i, j);
			vec2 r = vec2(b) - f + rand2(p + b);
			
			// chebyshev distance, one of many ways to do this
			float d = sqrt(abs(r.x*r.x) + abs(r.y*r.y));
			
			if(d < res.x)
			{
				res.y = res.x;
				res.x = d;
			}
			else if(d < res.y)
			{
				res.y = d;
			}
		}
	}
	return res.y - res.x;
}


void main(void) {
  vec2 position = (gl_FragCoord.xy * 2. -resolution) / resolution.y;
  vec2 p = (position - 0.) * 6.0 ;
  gl_FragColor = vec4(rings(p)) / voronoi(gl_FragCoord.xy);
}