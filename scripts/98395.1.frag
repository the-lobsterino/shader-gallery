//---------------------------------------------------------
//
// DuneStripes.glsl               by tholzer     2016-02-06   
//
// original:  https://www.shadertoy.com/view/MsG3Wm
///
//---------------------------------------------------------
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//---------------------------------------------------------
vec2 hash( vec2 p )                       // rand in [-1,1]
{
  p = vec2(dot(p,vec2(127.1,311.7)),
           dot(p,vec2(269.5,183.3)));
  return -1. + 2.*fract(sin(p+20.)*53758.5453123);
}

// 2d noise functions from https://www.shadertoy.com/view/XslGRr
float noise( in vec2 x )
{
  vec2 p = floor(x);
  vec2 f = fract(x);
  f = f*f*(3.0-2.0*f);
  vec2 uv = (p+vec2(37.0,17.0)) + f;
  vec2 rg = hash( uv/256.0 ).yx;
  return 0.5*mix( rg.x, rg.y, 0.5 );
}

//---------------------------------------------------------
#define NB 100      // number or gabor blobs
#define SIZE 0.25   // size of gabor blobs
                    // freq tuned by mouse.x

float rnd(int i, int j)
{
  return noise(vec2(i, j));
}

float DuneStripes (vec2 uv, float d, float freq, float time)
{
  float hv = 0.;
  for (int i=0; i<NB; i++) 
  {
    vec2 pos = vec2(rnd(i,0), rnd(i,1));
    vec2 dir = (1.+d)*vec2(rnd(i,2),rnd(i,3)) - d;
    hv += SIZE * sin(dot(uv-pos, freq*dir) * 6. + time);
  }
  return hv;
}
//---------------------------------------------------------
void main( void )
{
  vec2 uv = gl_FragCoord.xy / resolution.y;
  float frequence = mix(10., resolution.x/10., mouse.x);
  float h = DuneStripes(uv, -1.5, frequence, - 2.5*time);
  vec3 col = vec3(0.0,0.6,1.0)*h; // color
  gl_FragColor = vec4(col,1.0); // color
}
