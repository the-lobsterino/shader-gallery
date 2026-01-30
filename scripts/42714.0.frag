precision mediump float;

uniform float time;
uniform vec2 resolution;

#define LINES 9.0
#define BRIGHTNESS 1.3

const vec3 ORANGE = vec3(1.4, 0.8, 0.4);
const vec3 BLUE = vec3(0.5, 0.9, 1.3);
const vec3 GREEN = vec3(0.9, 1.4, 0.4);
const vec3 RED = vec3(1.8, 0.4, 0.3);
  
void main() {
  float x, y, xpos, ypos;
  float t = time *4.0;
  vec3 c = vec3(0.0);
  
  xpos = (gl_FragCoord.x / resolution.x);
  ypos = (gl_FragCoord.y / resolution.y);
  
  x = xpos;
  for (float i = 0.0; i < LINES; i += 1.0) {
    y = ypos + (
        0.150 * sin(x * 1.000 + i * 10.4 + t * 0.050)
      + 0.100 * cos(x * 6.350 + i * 0.7 + t * 0.250)
      + 0.024 * sin(x * 1000.35 + i * 0.8 + t * 0.134)
      + 0.600
    );
    
    c += vec3(1.03 - pow(
      clamp(abs(1.0 - y) * 50.0, 0.0, 1.0)  
    , 0.25));
  }
 
  c *= mix(
     mix(ORANGE, BLUE, xpos)
   , mix(GREEN, RED, xpos)
   ,(sin(t * 0.02) + 0.0) * 0.0
  ) * BRIGHTNESS;
  
  gl_FragColor = vec4(c, 1.0);
}
