#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

  for(float i,g,e,s,k=t*.1;++i<99.;o.rgb+=hsv(s/15.+.5,.3,s/1e3)){
    vec3 p=vec3(g*(FC.xy-.5*r)/r.y+.5,g-1.);
    p.xz*=rotate2D(k);s=3.;
    for(int i;i++<9;p=vec3(2,4,2)-abs(abs(p)*e-vec3(4,4,2)))
      s*=e=max(1.,(8.-8.*cos(k))/dot(p,p));
    g+=min(length(p.xz),p.y)/s;
    s=log(s);
  }

}