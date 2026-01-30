#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
  vec2 pos = vec2(mouse.x*resolution.x, mouse.y*resolution.y);
  pos.x += (10.0 + 10.0 * abs(mod(time, 6.0) - 3.0)) * cos(time*6.0);
  pos.y += (10.0 + 10.0 * abs(mod(time, 6.0) - 3.0)) * sin(time*5.0);
  float dist = length(gl_FragCoord.xy - pos) * 3.0;
  float color = 5.0/dist * abs(mod(time, 1.0) - 0.5);
  gl_FragColor = texture2D(backbuffer, gl_FragCoord.xy/resolution) * 0.9 + vec4(vec3(color), 1.0);
}