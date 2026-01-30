#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float wave(vec2 p, float angle) {
  vec2 direction = vec2(cos(angle), sin(angle));
  return cos(dot(p, direction));
}

float wrap(float x) {
  return abs(mod(x, 2.)-1.);
}

float odd(float n) {
  return mod(floor(n),2.)*2.0-2.0;
}

void main() {
  vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
  vec2 p = (position - 0.5) * 200.;
  //p += vec2(100.5);

  float brightness = 0.;
  for (float i = 1.; i <= 41.; i++) {
    brightness += wave(p+vec2(i*1.), time / i *odd(i));
  }


	brightness = wrap(brightness/5.);
  
  gl_FragColor.rgb = vec3(brightness);
  

	gl_FragColor.a = 0.5;
}