//---------------------------------------------------------
// rectangle shader
//---------------------------------------------------------

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;

//---------------------------------------------------------
// draw rounded rectangle
//---------------------------------------------------------
float roundedRectangle (vec2 pt, vec2 pos, vec2 size, float radius, float thickness)
{
  float d = length(max(abs(pt - pos), size) - size) - radius;
  //return 1.0 - smoothstep(thickness, thickness+0.01, d);
  return smoothstep(0.6, 0.0, d / thickness);
}
//---------------------------------------------------------
// draw rectangle frame with rounded edges
//---------------------------------------------------------
float roundedFrame (vec2 pt, vec2 pos, vec2 size, float radius, float thickness)
{
  float d = length(max(abs(pt - pos), size) - size) - radius;
  return 1.0 - smoothstep(thickness, thickness+0.01, abs(d));
  //return smoothstep(1., 0., abs(d / thickness));
}
//---------------------------------------------------------
void main()
{
  vec2 npos = gl_FragCoord.xy / resolution.xy;   // 0.0 .. 1.0
  float aspect = resolution.x / resolution.y;    // aspect ratio x/y
  vec2 ratio = vec2(aspect, 1.0);                // aspect ratio (x/y,1)
  vec2 uv = (2.0 * npos - 1.0) * ratio;          // -1.0 .. 1.0

  gl_FragColor = vec4(uv, 1.0, 1.0);

  vec2 mp = mouse / resolution;
  vec2 pos = vec2(0.0, 0.0);
  vec2 size = vec2(1.0, 0.2);
  float intensity = 0.0;
  float radius = 0.08;
  float thickness = 0.02 + 22.*mp.y;
  vec3 col = vec3(0.2, 0.2, 0.1);  // background
	
  if (mouse.x > 0.5)
  {
    //--- rounded rectangle ---
    const vec3 rectColor = vec3(0.0, 1.0, 0.6);
    intensity = 0.6 * roundedRectangle (uv, pos, size, radius, thickness);
    col = mix(col, rectColor, intensity);
  }
  else 
  {
    //--- rounded frame ---
    const vec3 frameColor = vec3(0.0, 0.6, 1.0);
    intensity = roundedFrame (uv, pos, size, radius, thickness);
    col = mix(col, frameColor, intensity);
  }

  gl_FragColor = vec4 (col, 1.0);
}

