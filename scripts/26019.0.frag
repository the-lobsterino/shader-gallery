
// WaveSalad.glsl by I.G.P.
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;



float rand(vec2 co){
    return fract(time*.1/length(surfacePosition/resolution)+sin(dot(surfacePosition.xy ,vec2(12.9898,78.233))) * 43789.5453);
}
void main(void)
{
  vec2 sp = surfacePosition * 3.0;
  float color = 0.0;
  for (int i = 0; i < 22; ++i)
  {
    float t = float(i)/cos(4.0*(time*0.1)) - rand(vec2(time,time))*0.2 - time/300.;
    color += 0.03/distance(sp,vec2(sp.x,sin(t+sp.x)));
  }
  gl_FragColor = vec4(color * vec3(.1, 0.05, 0.0), 1.0);
}