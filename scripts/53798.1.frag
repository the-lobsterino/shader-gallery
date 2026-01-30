/* Original shader: butterfly fractal created By Seyed Morteza Kamali
 *            from: https://www.shadertoy.com/view/Ws2XRK 
 * http://glslsandbox.com/e#53798.1
 */

#ifdef GL_ES
  precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

#define R resolution.xy
#define HALF_PI 1.57079632679

#define animate true
#define first sin(time*0.3)<0.0

vec3 hsv2rgb( in vec3 c ) 
{
  vec3 rgb = clamp( abs(mod(c.x+vec3(0.,4.,2.),6.)-3.)-1., 0., 1.);
  return c.z * mix( vec3(1.0), rgb, c.y);
}

mat2 rotate2d(float angle)
{ 
  float ca = cos(angle), sa = sin(angle);
  return mat2(ca,-sa,sa,ca);
}

vec3 pixelColor(vec2 p)
{
  p /= length(p*p);
  vec2 z = vec2(p);  
  #define accurate 10.
  for (float i = 1.; i <= accurate; i++)
  {  
    z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + p; 
    if (!animate)
         z.x *= mix(1.,atan(i,i)/2.9,1.-0.1*abs(cos(time)));	    
    else z.x *= mix(1.,atan(i,i)/2.9,1.);
    if (first)	    
      z += vec2(z.x*z.x - z.y*z.y, 0.13*z.x*z.y);     

    if (888.0 < dot(z, p))
      return hsv2rgb(vec3(mod(z.x*100.,1.0),0.8,0.8));
  }
  return vec3(1.);
}

void main(void)
{
  vec2 c = 1.8*(-2.0*gl_FragCoord.xy/R + 0.9)*vec2(R.x/R.y, 1.0) + vec2(0.25, 0.);
  c *= rotate2d(HALF_PI);   // +90°
  if (animate)
    c.y /= 1.06-max(-0.06, -cos(4.0*time));
  
  const float a = 5.0;
  float e = 1.0/min(R.x, R.y);    
  vec3 col = vec3(0.0);
    
  for (float j = -a; j < a; j++)
    for (float i = -a; i < a; i++)
      col += pixelColor(c + 2.1*vec2(i, j) * (e/a)) / (4.0*a*a);

  gl_FragColor = vec4(col, 1.0);
}
