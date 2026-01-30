precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
  vec2 uv = (2.*gl_FragCoord.xy-resolution.xy)/resolution.y;
  vec3 v = vec3(1.7*uv,1.);
  for(float i=0.;i<9.;i++){
  v = abs(mouse.xyy+v-dot(v,v-vec3(cos(time),sin(time),.4)));
  }
  v = smoothstep(.8, -1.,v);
  gl_FragColor = vec4(v, 1.0 );
}