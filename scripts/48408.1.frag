#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void )
{
  const vec3 bgColor = vec3(1.0,0.59,0.4);
  float maxRadius = max(resolution.x,resolution.y)/4.;
  vec3 color = bgColor;
  color *= distance(gl_FragCoord.xy,resolution.xy/2.)<=(maxRadius*mod(time,1.))? (mod(time,1.)): 1.;
  gl_FragColor = vec4(color,1.);
}