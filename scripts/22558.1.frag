#ifdef GL_ES
precision mediump float;
#endif

// Port of http://guciek.github.io/web_mandelbrot.html

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 hsv2rgb(vec3 hsv)
{
  vec3 rgb = vec3(-1.0);
  hsv.x = (hsv.x-floor(hsv.x))*6.0;
  if (hsv.y < 0.0) hsv.y = 0.0;
  if (hsv.y > 1.0) hsv.y = 1.0;
  if (hsv.z < 0.0) hsv.z = 0.0;
  if (hsv.z > 1.0) hsv.z = 1.0;
  float f = hsv.x - floor(hsv.x);
  hsv.x = floor(hsv.x);
  if (hsv.x == 0.0) rgb = vec3(1.0, 1.0-(1.0-f)*hsv.y, 1.0-hsv.y);
  else if (hsv.x == 1.0) rgb = vec3(1.0-hsv.y*f, 1.0, 1.0-hsv.y);
  else if (hsv.x == 2.0) rgb = vec3(1.0-hsv.y, 1.0, 1.0-(1.0-f)*hsv.y);
  else if (hsv.x == 3.0) rgb = vec3(1.0-hsv.y, 1.0-hsv.y*f, 1.0);
  else if (hsv.x == 4.0) rgb = vec3(1.0-(1.0-f)*hsv.y, 1.0-hsv.y, 1.0);
  else rgb = vec3(1.0, 1.0-hsv.y, 1.0-hsv.y*f);
  rgb *= hsv.z;
  return rgb;
}

vec3 palette(float d)
{
  float v = sin(d*0.1847969)*0.5 + 0.5;
  return hsv2rgb(vec3(d*0.00521336, (sin(d*0.162012467)*0.5+0.5)*(1.0-v), v));
}

vec3 interpolate(vec3 a, vec3 b, float t)
{
  return a+t*(b-a);
}

void main( void ) {
        vec2 z, nz, z0;
	vec3 col = vec3(0.0);
	float iter = -1.0;
	z0 = z = surfacePosition;
	for (float i=0.0; i<300.0; ++i)
	{
	   nz = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y);
           z = nz + z0;
	   if (z.x*z.x+z.y*z.y > 4.0)
	   {
	     iter = i;
             break;
           }
	}
	if (iter > 0.0)
	{
	   nz = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y);
           z = nz + z0;
	   nz = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y);
           z = nz + z0;
	   float d = log(iter+60.0-log(log(z.x*z.x+z.y*z.y)*0.5)*1.44269504)*100.0;
	   float p = floor(d);
	   col = interpolate(palette(p), palette(p + 1.0), d - p);
	}

	gl_FragColor = vec4(col, 1.0 );

}