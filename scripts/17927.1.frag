/*
  Daily an hour GLSL sketch by @chimanaco 17/30

  Reference:
  http://www.demoscene.jp/?p=1147
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 trans(vec2 p)
{
  return vec2(p.x, p.y + sin(p.x * 10.0 + time * 8.9)* 0.4);
}

void main( void ) {
  vec2 position = (gl_FragCoord.xy * 2.0 -resolution) / resolution.y;
  vec2 pos = mod(position * 4.0, 2.0)- 1.0;
  vec2 p = trans(pos);
     
  float c = .0;
  vec3 color;
  float x = p.x;
  float y = p.y;
  float size = 1.;
  vec2 p0 = vec2(0.,size/1.732); // sqrt(3) = 1.73205080757
  vec2 p1 = vec2(-size,-size/3.464); // 2*sqrt(3) = 3.46410161514
  vec2 p2 = vec2(size,-size/3.464);

  for (int i = 0; i < 3; i++) {

  if ( y-p0.y < (p1.y-p0.y)/(p1.x-p0.x)*(x-p0.x) &&
       y-p1.y > (p2.y-p1.y)/(p2.x-p1.x)*(x-p1.x) &&
       y-p2.y < (p0.y-p2.y)/(p0.x-p2.x)*(x-p2.x) ) {
    c = mod(float(i)+1.,10.)*.1;
    color = hsv2rgb(vec3(c + time / 10., 0.7, 0.8));    
  }
    p0 = p0/2.;
    p1 = p1/2.;
    p2 = p2/2.; 
  }
  gl_FragColor = vec4( color, 1.0 );
}