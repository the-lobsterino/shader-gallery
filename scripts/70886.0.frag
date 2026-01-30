// Recursive_Rotation

precision mediump float;

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
varying vec2 surfacePosition;

#define R 5.0

float distanceSphere(vec2 p, float r) { return length(p) - r; }

float distanceSquare(vec2 p, float r) { return length(p*p) - r; }

//float lerp (float a, float b, float k) { return a+(b-a)*k; }

float map(vec2 p, float r) 
{
  float d1 = distanceSphere(p,r);
  float d2 = distanceSquare(p,r);
  return mix(d1,d2,0.5+0.5*sin(time));
}

mat2 rotate(float a) 
{
  float s = sin(a), c = cos(a);
  return mat2(c, s, -s, c);
}

float distanceFractal(vec2 p)
{
  float d = 0.5;
  for(int i=0;i<4;i++)
  {
    d = min(d, map(p, 1.2));
    //perform folds
    p.xy *= rotate(0.2*time);
    if(p.x>0.) p.x = -p.x;
    if(p.y>0.) p.y = -p.y;
    //scale and translate
    float s = R*(1.0+mouse.y);
    p = p*2.5 + s;
  }
  return min(d, map(p,4.));
}

void main( void ) 
{
//vec2 p = (gl_FragCoord.xy-resolution.xy*0.5)/resolution.y*12.;
  vec2 p = surfacePosition * 12.0;
  float d = distanceFractal(p);
  gl_FragColor = vec4((0.5*d)*p.x, d*d*p.y+0.2, d, 1.0);
}