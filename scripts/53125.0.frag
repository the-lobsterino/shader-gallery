precision mediump float;

uniform float time;
uniform vec2 resolution;

#define LINES 10.0

  
void main() {
  float x, y, xpos, ypos;
  float t = time * 12.0;
  vec3 c = vec3(0.0);
  
  xpos = (gl_FragCoord.x / resolution.x);
  ypos = (gl_FragCoord.y / resolution.y);
  
  x = xpos;
  for (float i = 0.0; i < LINES; i += 5.0) {
    y = ypos + (
        0.146 * cos(x * 10.100 + i * 0.4 + t * 0.10)
      + 0.101 * cos(x * 4.350 + i * 1.7 + t * 0.20)
      + 0.120 * sin(x * 5.0 + i * 0.8 + t * 0.14)
      + 0.59
    );
    
    c.r += (1.0 - pow(clamp(abs(1.0 - y) * 0.1, 0.0, 1.1) , 0.1));
	  
    c.g += (1.0 - pow(
      clamp(abs(1.4 - y) * 0.5, 0.09, 1.5)  
    , 0.1));
	
    c.b += (pow(
      clamp(abs(1.4 - y) * 6.0, 9.1, 4.5)  
    , 0.5));
  }
  
  gl_FragColor = vec4(c, 1.0);
}
