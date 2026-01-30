#ifdef GL_ES
  precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Koch_Snowflake

vec2 cplxmul(vec2 a, vec2 b)
{ return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);
}
vec2 cplxdiv(vec2 a, vec2 b)
{ return cplxmul(a,vec2(b.x,-b.y))/(b.x*b.x+b.y*b.y);
}
float col(vec2 z,float sp)
{ return z.y<0.0 ? 1000.0
    : sp*length(z-vec2(clamp(z.x, -1.0, 1.0),0.0)); 
}
float getcol(vec2 z, vec2 z0, vec2 z1)
{ vec2 center=(z0+z1)/2.0;
  float sp0=mouse.x;
  return col(cplxdiv(z-center,z1-center), sp0*length(z1-z0));
}
float get (vec2 z, vec2 z1, vec2 z2)
{
  for(int i=0;i<10;i++)
  { vec2 z3=z1+cplxmul(z2-z1, vec2(0.5, 1.0/(2.0*sqrt(3.0))));
    if(dot(z-z3, z2-z1)<-0.0)
    { vec2 z4=(2.0*z1+z2)/3.0;
      if(dot(z-z4, z3-z1)<0.0) z2=z4;
      else { z1=z4; z2=z3; }
    }
    else
    { vec2 z4=(z1+2.0*z2)/3.0;
      if(dot(z-z4, z2-z3)<0.0)
      { z1=z3; z2=z4; }
      else z1=z4;
  } }
  return getcol(z,z1,z2);
}

void main(void) 
{
  vec2 z0 = 2.0*(gl_FragCoord.xy / resolution.x)-vec2(1,0.7); //+ mouse / 4.0;
  vec2 z = z0*3.0;
  vec2 z1 = vec2(-1.0, 0.0);
  vec2 z2 = vec2( 1.0, 0.0);
  vec2 z3 = vec2( 0.0, -sqrt(3.0));
  float d = min(min(get(z,z1,z2), get(z,z2,z3)), get(z,z3,z1));
  gl_FragColor=vec4(vec3(1.0) / pow(35.0*d+1.0, 1.0), 1.0);
}