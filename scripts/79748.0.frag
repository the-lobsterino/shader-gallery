#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

const float pi = 3.14159;
const float n = 6.0;

void main()
{ vec2 pos = surfacePosition;
  float radius = length(pos)*4.0 - 1.6;
  float t = atan(pos.y, pos.x)/pi;
	
  vec3 color = vec3(0.2);
  for (float i = 0.0; i < n; i++){
    color.r += 0.004/abs(0.21*sin(6.0*pi*(t + i*i/n*time*0.1)) - radius);
    color.g += 0.005/abs(0.12*sin(7.0*pi*(t + i*i/n*time*0.1)) - radius);
    color.b += 0.006/abs(0.15*sin(8.0*pi*(t + i*i/n*time*0.1)) - radius);
  }
  gl_FragColor = vec4(0.5 * color, color);
}
