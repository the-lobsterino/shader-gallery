#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
  float y = gl_FragCoord.y;
  float x = gl_FragCoord.x;
  
  vec3 rgb = vec3(
    y > 150.0 && y < 350.0 && x > 250.0 && x < 450.0
      ? vec3(1.0, 1.0, 1.0)
      : vec3(0.0, 0.0, 0.0)
  );
	
  //vec2 c = vec2(gl_FragCoord.x/500.0, gl_FragCoord.y/500.0);
  gl_FragColor = vec4(rgb, 1);
}