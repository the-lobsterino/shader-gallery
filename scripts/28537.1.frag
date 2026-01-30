// SimpleLightedSphere 
// set light position with mouse

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buffer;
#define RADIUS 0.4;

void main( void ) 
{
  vec2 uv = gl_FragCoord.xy - resolution.xy * 0.5;
  uv /= min(resolution.x, resolution.y) * RADIUS;
  float m = pow(dot(uv, uv), cos(time-.1/length(uv)));   
  if (m < 1.0)
  { vec3 p = vec3(uv.x, uv.y, sqrt(1.0 - m)); 
    vec3 light = normalize(vec3(mouse.xy - 0.5, 0.5));
    gl_FragColor = vec4(dot(p, light));   
  } else gl_FragColor = vec4(0.25, 0.25, 0.25, 1.0);
  gl_FragColor += 0.95*(texture2D(buffer, (gl_FragCoord.xy+floor(-5.*(mouse-.5)))/resolution)-gl_FragColor);
}