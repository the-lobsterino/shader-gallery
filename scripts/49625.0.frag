#ifdef GL_ES 
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// http://glslsandbox.com/e#49591.10

// return random rgb color 
// replacement for Shadertoy RGBA Noise texture
vec3  RandomRGB (vec2 p)
{
  if (mouse.x > 0.3) p += time; 

  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); 
  p3 += dot(p3, p3.yxz + 19.19);
  //p3 = fract(((p3.xxy + p3.yzz) * p3.zyx));	
  return p3;   // please set this line under comment!!
  return fract(((p3.xxy + p3.yzz) * p3.zyx));   // can not be saved ???
  return mod(((p3.xxy + p3.yzz) * p3.zyx),1.0); // can not be saved ???
}

void main( void ) 
{
  gl_FragColor = vec4(RandomRGB(gl_FragCoord.xy), 1.0);
}
