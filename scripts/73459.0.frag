// Modified so it doesn't really move. Very childish and easy fix.
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

const float Pi = 3.14159;
uniform vec2 mouse;

const int   complexity      = 30;    // More points of color.
const float fluid_speed     = 4.0;  // Drives speed, higher number will make it slower.
const float color_intensity = 0.8;
  

void main()
{
  vec3 col = vec3(0.0);
  vec3 colorIn  = vec3(0.243,0.058,0.390);
  vec3 colorOut = vec3(0.885,0.783,0.865);
  vec2 p=gl_FragCoord.xy/resolution.xy;
  for(int i=1;i<complexity;i++)
  {
    vec2 newp=p + time*0.001;
    newp.x+=0.6/float(i)*sin(float(i)*p.y+time/fluid_speed+0.3*float(i)) + 0.5;
    newp.y+=0.6/float(i)*sin(float(i)*p.x+time/fluid_speed+0.3*float(i+10)) - 0.5;
    p=newp;
  }
  float pct = sin(1.6 * p.x) * sin(1.6 * p.y);
  col = mix(colorIn, colorOut, pct);
  //vec3 col=vec3(color_intensity*sin(3.0*p.x)+color_intensity,color_intensity*sin(3.0*p.y)+color_intensity,color_intensity*sin(p.x+p.y)+color_intensity);
  //col = mix(colorIn, colorOut, sin(p.x));
  gl_FragColor=vec4(col, 1.0);
  
}
