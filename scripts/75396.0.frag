#ifdef GL_ES//https://the book of shaders.com/07/?lan=jp
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main(){
  vec2 st = gl_FragCoord.xy/resolution.xy;
  st.x *= resolution.x/resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;

  // Remap the space to -1. to 1.
  st = st *2.-1.;

  // Make the distance field
  d = length( (st)-.3 );

  // Visualize the distance field
  gl_FragColor = vec4(vec3(fract(d*10.0)),1.0);

}
