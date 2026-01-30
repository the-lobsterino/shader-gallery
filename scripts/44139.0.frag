precision mediump float;
uniform float time;
uniform vec2 resolution;

void main( void ) { 
  gl_FragColor = vec4(1.0-floor((gl_FragCoord.x / resolution.x) * 10.0)*0.1);
}