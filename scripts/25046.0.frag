#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

precision highp float;
varying vec3 fPosition;
varying vec3 fNormal;

uniform sampler2D tex0;


void main()
{
  
  float border = 0.01;
  float circle_radius = 0.5;
  vec4 circle_color = vec4(1.0, 1.0, 1.0, 1.0);
  vec2 circle_center = vec2(0.5, 0.5);
  
vec2 uv = gl_FragCoord.xy;
  vec4 bkg_color = texture2D(tex0,uv * vec2(1.0, -1.0));
  
  // Offset uv with the center of the circle.
  uv -= circle_center;
  float dist = sqrt(dot(uv, uv));
  
  if ( (dist > (circle_radius+border)) || (dist < (circle_radius-border)) )
gl_FragColor = bkg_color;
else
gl_FragColor = circle_color;
}
  