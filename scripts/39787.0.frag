// Newtow Fractal 1-z^3 with abs() by @hintz
// v2 HSV2RGB changed
// What about to go 3d like http://www.josleys.com/show_gallery.php?galid=338 ?

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float deltax = 42.0 + sin(time*0.04) * 100.0;
float deltay = resolution.y / resolution.x * deltax;

float theta = time*0.1;
float cosThetaPi = cos(theta);
float sinThetaPi = sin(theta);

// for pretty colors: Hue-Saturation-Value to Red-Green-Blue
vec4 HSV2RGB(vec3 hsv) 
{ vec3 rgb = ((clamp(abs(fract(hsv.x +vec3(0.,2./3.,1./3.))*2.-1.)*3.-1.,0.,1.)-1.)*hsv.y+1.)*hsv.z;
  return vec4 (rgb,1.0);
}

// complex number multiplication: a * b
vec2 mul(vec2 a, vec2 b)
{
  return vec2(a.x*b.x - a.y*b.y, 
	      a.y*b.x + a.x*b.y);
}

// complex number division: a / b 
vec2 div(vec2 a, vec2 b)
{
  return vec2((a.x*b.x + a.y*b.y) / (b.x*b.x + b.y*b.y), 
	      (a.y*b.x - a.x*b.y) / (b.x*b.x + b.y*b.y));
}

vec2 znext(vec2 z)       //     1 - z^3
{                        // z - -------
  vec2 z2 = mul(z,z);    //     3 * z^2
  return z - div(vec2(1.0,0.0)+mul(z2,z), 3.0*z2);
}

vec2 newtonfractal(vec2 z)
{
  for (int n=0; n<100; n++)
  {
    vec2 old = z;
    z = znext(z);
    vec2 d = z - old;
    d *= 22.*d;
    d = abs(d);
    if (d.x+d.y < 0.01)
      return vec2(z.x +z.y+time/10.0 , float(n)*0.06);
  }
  return z;
}

void main(void)
{
  float real = deltax * (gl_FragCoord.x / resolution.x - 0.5);
  float imag = deltay * (gl_FragCoord.y / resolution.y - 0.5);
 
  float realR = real*cosThetaPi - imag*sinThetaPi;
  float imagR = real*sinThetaPi + imag*cosThetaPi;
	
  vec2 results = newtonfractal(vec2(realR, imagR));

  float h = results.x;
  float v = 1.0-results.y;
  float s = 0.8;
vec4 c=HSV2RGB(vec3(h, s, v));
	vec4 c2=vec4(vec3(1.0),1.0);
	if(mod(mod((real)*10.0,c.y)+c.y,c.y)<0.1){
		c2.x=0.0;
	}
	if(mod(mod((sqrt(real*real+imag*imag))*10.0,c.z)+c.z,c.z)<0.1){
		c2.y=0.0;
	}
	if(mod(mod((imag)*10.0,c.w)+c.w,c.w)<0.1){
		c2.z=0.0;
	}
  gl_FragColor = c2;
}
