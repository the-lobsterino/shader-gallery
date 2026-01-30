#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

const float   complexity    = 420.0;    // More points of color.
const float mouse_factor    = 100000.0;  // Makes it more/less jumpy.
const float mouse_offset    = 10.0;   // Drives complexity in the amount of curls/cuves.  Zero is a single whirlpool.
const float fluid_speed     = 2.5;  // Drives speed, higher number will make it slower.
const float color_intensity = 1.0;
const float darkness        = 4.;
const float pi = 3.14159265358979;
const float viscosity       = 100.; 

void main()
{
  vec2 p = (gl_FragCoord.xy-resolution) / resolution;
  
  for(float i = 1.0; i < complexity; i++) {
    vec2 newp = p;
    newp.x += fract(abs(sin(time/viscosity))*0.5)/ i * sin(i*p.y+time/fluid_speed+0.6*i);
    newp.y += fract(abs(sin(time/viscosity))*0.5)/ i * sin(i*-p.x+time/fluid_speed+0.6*(i+10.));
    p = newp;
  }
  vec3 col = vec3(color_intensity*sin(3.0*p.x)+color_intensity,
		  color_intensity*sin(3.0*p.y)+color_intensity,
		  sin(p.x+p.y)) / darkness;
  gl_FragColor = vec4(col, 1.0);
}
