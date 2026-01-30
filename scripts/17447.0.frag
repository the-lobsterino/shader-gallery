precision mediump float;

uniform float time;
uniform vec2 resolution;

#define LINES 2.0
#define BRIGHTNESS 1.8

const vec3 ORANGE = vec3(1.4, 0.0, 0.0);
const vec3 BLUE = vec3(0.5, 0.0, 0.0);
const vec3 GREEN = vec3(0.9, 0.0, 0.0);
const vec3 RED = vec3(1.8, 0.0, 0.0);
  
void main() {
  float x, y, xpos, ypos;
  float t = time * 60.0;
  vec3 c = vec3(0.0);
  
  xpos = (gl_FragCoord.x / (resolution.x / 2.0));
  ypos = (gl_FragCoord.y / (resolution.y / 0.9));
  
	#define t time + ypos*100.*cos(time+sin(xpos*22.*sin(time+exp(log(ypos)+5.*cos(time))))*10.)
  x = xpos;
  for (float i = 0.0; i < LINES; i += 1.0) {
    y = ypos + (
        0.150 * sin(x * 5.000 + i * 0.2 + t * 0.050)
      + 0.100 * cos(x * 16.350 + i * 0.7 + t * 0.250)
      + 0.024 * sin(x * 1000.35 + i * 0.8 + t * 0.1)
      + 0.600
    );
    
    c += vec3(1.0 - pow(
      clamp(abs(1.0 - y) * 40.0, 0.0, 1.0)  
    , 0.5));
  }
 
  c *= mix(
     mix(ORANGE, BLUE, xpos)
   , mix(GREEN, RED, xpos)
   ,(sin(t * 0.0) + 1.0) * 0.50
  ) * BRIGHTNESS;
  
  gl_FragColor = vec4(c, 1.0);
}
