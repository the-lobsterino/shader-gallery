#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
// HexPattern by I.G.P. 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI=atan(0.0,-1.0);

vec3 HSVtoRGB(vec3 hsv)
{return((clamp(abs(fract(hsv.x +vec3(0.,2./3.,1./3.))*2.-1.)*3.-1.,0.,1.)-1.)*hsv.y+1.)*hsv.z;}

void main( void )
{
  vec2 p = 20.*( gl_FragCoord.xy / resolution.yy )-vec2(0.5)*resolution.xx/resolution.yx;
  float limit=sin(PI*3.5)+1.0;
  p.x = p.x/3.0*sqrt(3.0);
  p *= 3. +sin(0.5*time);
  if(cos(p.y)*cos(p.x)+cos(p.x)*cos(p.x) < limit)
    gl_FragColor = vec4( HSVtoRGB(vec3(mod(time/10.0,1.0),1.0,0.7)), 1.0 );
  else gl_FragColor = vec4(0.1,0.1,0.1,1.0);
}