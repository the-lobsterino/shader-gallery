#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 paint (vec3 p) { 
  p = normalize(p);
  p.z += 1.0;
  p = normalize(p);
  return p;
}

void main() {
  vec3 p = vec3(0.0,0.0,1.0);
  gl_FragColor = vec4(paint(p)-vec3(0.0,0.0,1.0),1.0);
}

