#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 color;


vec3 rgb(float r, float g, float b) {
  return vec3(r/255., g/255., b/255.);
}

void main(void)
{
  const float PI = 3.0415926535;

  vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / resolution.y;
  vec2 uv = p;
  vec2 st = gl_FragCoord.xy / resolution.xy;

  float w = sin(
    (uv.x + uv.y - time * .75 + sin(1.5 * uv.x + 4.5 * uv.y) * PI * .3) 
    * PI * .6
  );

  uv *= 8. + (.99 - .1 * w);
  color = vec3(1, 0, 0);
  float tilt = .01 * sin(10. * st.x + time);
  

  
  color = rgb(255., 255., 255.);
   


  color += w * .225;
  color *= .8;
  gl_FragColor = vec4(color, 1.);
}