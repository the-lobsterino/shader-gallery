
// WaveSalad.glsl by I.G.P.
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;


void main(void)
{
  vec2 sp = surfacePosition * 3.0;
  float color = 0.0;
  for (int i = 0; i < 22; ++i)
  {
    float t = float(i)/(4.0*cos(time*0.1)) - time*0.2;
    color += 0.03/distance(sp,vec2(sp.x,sin(t+sp.x)));
  }
  gl_FragColor = vec4(color * vec3(.1, 0.05, 0.0), 1.0);
}