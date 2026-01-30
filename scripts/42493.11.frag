// FractalWobbler.glsl       2017-09-16
// original http://glslsandbox.com/e#42484.1 by sphinx
// modifications by I.G.P.

#ifdef GL_ES
  precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define ITERATIONS 6.

vec2 rotate(vec2 f, float a) 
{
  float c= cos(a), s = sin(a);
  return vec2(f.x*c - f.y*s, f.x*s + f.y*c);
}

vec4 fractal(in vec2 uv)
{
  vec4 a = vec4(uv,0,0),   b = vec4(0),  result = b;
  for ( float i = 0.; i < ITERATIONS; i++ )
  {
    { b	= fract(b - a.xwyz);
      b	*= 1.5 - b;
      a += a.wxyz;
      a = a.xywz * 0.5 + b.wxyz * 1.5;
      result += b;
    }		
  }
  //return result;    // [save] button do NOT work ???
  return vec4(result.xyz,0);
}

void main(void) 
{
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
  vec2 c = p / dot(p,p);
	
  float centerDistance = distance(c, vec2(0.5)) / 14.0;
  c = rotate(c, max(-1.0, sin(time + centerDistance + sin(time + centerDistance))));
		
  vec4 fc = fractal(c);
  gl_FragColor = fc*0.02*dot(fc,fc) * (0.4 - centerDistance*0.7);	
}

