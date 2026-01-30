#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

      vec2 pos = vec2(gl_FragCoord.xy) * 0.01 + time;
      float angle = 10.0;
      vec2 dist = vec2(cos(angle), sin(angle));
      vec2 dist2 = vec2(tan(angle), sin(angle));
      float b1 = cos(dot(pos, dist)) + 0.8;
      float b2 = -cos(dot(pos, dist2)) + 3.6;
      vec4 totalB = (b1 * vec4(0.3, 0.4, 1.9, 1.0)) + (b2 * vec4(0.2, 0.2, 3.0, 1.0));
      gl_FragColor = totalB;
}