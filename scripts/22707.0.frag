//---------------------------------------------------------
// Shader:   Circle2d.glsl
//---------------------------------------------------------
#ifdef GL_ES
  precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

const float PI = 3.141592653589793238463;

//---------------------------------------------------------
// return intensity of antialised circle at given position
//---------------------------------------------------------
float circle(vec2 pos, float radius, float thick)
{
  return mix(1.0, 0.0, smoothstep(thick, thick + 0.005, abs(length(pos) - radius)));
}

//---------------------------------------------------------
void main( void ) 
{
  float intensity = circle(surfacePosition, 0.3+0.1*sin(time), 0.02);
  gl_FragColor = vec4(intensity);
}