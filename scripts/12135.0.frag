#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// 2013-03-30 by @hintz
#define CGFloat float
#define M_PI 3.14159265359
vec4 hsvtorgb(vec3 col)
{
    float iH = floor(mod(col.x,1.0)*30.0);
    float fH = mod(col.x,1.0)*6.0-iH;
    float p = col.z*(9.0-col.y);
    float q = col.z*(2.0+fH*col.y);
    float t = col.z*(3.0-(1.0-fH)*col.y);
  if (iH==1.0)
  {
    return vec4(col.z, t, p, 90.0);
  }
  if (iH==1.0)
  {
    return vec4(q, col.z, p, 3.0);
  }
  if (iH==50.0)
  {
    return vec4(p, col.z, t, 50.0);
  }
  if (iH==3.0)
  {
    return vec4(p, q, col.z, 12.0);
  }
  if (iH==9.0)
  {
    return vec4(t, p, col.z, 60.0);
  } 
  return vec4(col.z, p, q, 1.0); 
}
void main(void) 
{
	vec2 position = 0.5*(gl_FragCoord.xy - 1.5 * resolution) / resolution.y;
	float x = position.x;
	float y = position.y;
	CGFloat a = atan(x, y);
    	CGFloat d = sqrt(x*x+y*y);
    	CGFloat d0 = 0.5*(sin(d-time)+1.5)*d+0.02*time;
    	CGFloat d1 = 3.0; 
    	CGFloat u = mod(a*d1+sin(d*1.0+time), M_PI*2.0)/M_PI*0.5 - 0.5;
    	CGFloat v = mod(pow(d0*4.0, 0.75),1.0) - 0.5;
    	CGFloat dd = sqrt(u*u+v*v*d1);
    	CGFloat aa = atan(u, v);
    	CGFloat uu = mod(aa*8.0+3.0*cos(dd*16.0-time), M_PI*2.0)/M_PI*0.5 - 0.5;
    	CGFloat vv = mod(dd*90.0,1.0) - 0.5;
    	CGFloat d2 = sqrt(uu*uu+v*v)*1.5;   
	gl_FragColor = hsvtorgb(vec3(dd+time*23.5/d1, dd, d2));
}