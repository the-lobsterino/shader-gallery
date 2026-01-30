#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

mat2 matRotate(float angle)
{
    float c = cos(angle);
    float s = sin(angle);
    return mat2( c, s, -s, c );
}

float ellipse (vec2 uv, vec2 endp, float phi, float scale) {
  vec2 midp = endp-vec2(0.2,0.);
  
  vec2 v = uv-endp;
  
  //rotate
  v = matRotate(-phi)*v;
  
  if (v.x > 0.2*scale)
    return -1.;
  
  //scale
  v /= scale;
  
  return (1.0 - ((v.x*v.x)/0.04+(v.y*v.y)/(0.02-0.08*v.x)));
}

void main( void ) {

  vec2 uv = gl_FragCoord.xy / max(resolution.x,resolution.y);
  vec4 color = vec4(0.);
  
  float scale = 0.4;
  vec2 endp = vec2(0.5,0.2);
  float eps = 0.05;
  float phi = 0.0;
  
  bool hit = false;
  float inc = 0.2;
  for (int i=0; i<1; ++i)
  {
    if (ellipse(uv, endp, time*4., scale)>=0.)
    {
      hit = true;
      break;
    }
    scale += inc;
    phi += 0.1;
  }
  if (hit)
    color = vec4(1., 0., 0., 1.);
  else
    color = vec4(0., 0., 1., 1.);

  gl_FragColor = color;

}