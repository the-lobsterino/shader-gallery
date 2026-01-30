precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
const int   complexity      = 24;    // More points of color.
const float fluid_speed     = 38.0;  // Drives speed, higher number will make it slower.
vec3 hsv2rgb(float h,float s,float v) { return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v; }

void main() {
  vec2 p=.2*(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
  p *= mouse.y*8.3+.4; p /= dot( p*mouse, p/mouse*2. );  // ändrom3da tweak
  #define time time*16.
  p -= 8.*mouse;
  for(int i=1;i<complexity;i++)
     { vec2 newp=p + time*0.001;
     newp.x+=0.6/float(i)*sin(float(i)*p.y+time/fluid_speed+0.3*float(i)) + 0.5; // + mouse.y/mouse_factor+mouse_offset;
     newp.y+=0.6/float(i)*sin(float(i)*p.x+time/fluid_speed+0.3*float(i+10)) - 0.5; // - mouse.x/mouse_factor+mouse_offset;
     p = newp; }
  float mix_ratio = 0.4 * sin(3.0 * p.x) + 0.6;
  vec3 col;
  col= hsv2rgb( mix_ratio/1.5 -.5, .9, .9 );
  gl_FragColor = vec4( col, 1. ); } //ändrom3da tweak