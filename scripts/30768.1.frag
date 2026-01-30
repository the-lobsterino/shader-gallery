// 2D RoundedFrame, RoundedRectangle 

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 uv;

float roundedRectangle (vec2 pos, vec2 size, float radius, float thickness)
{
  float d = length(max(abs(uv-pos), size) - size) - radius; 
  return smoothstep(1.0, 0.0, d / thickness);
}

float roundedFrame (vec2 pos, vec2 size, float radius, float thickness)
{
  float d = length(max(abs(uv-pos), size) - size) - radius; 
  return smoothstep(1.0, 0.0, abs(d / thickness));
}

void main( void ) 
{
  uv = 2.0*( gl_FragCoord.xy / resolution.xy ) - 1.0; 
  uv.x *= resolution.x/resolution.y; 
  vec3 col = vec3(0); 
	
  //--- rounded frame ---
  vec2 pos = vec2(0.6 + 0.04*sin(time), 0.5) ;
  vec2 size = vec2(0.4, 0.2); // size
  float radius = 0.15;  // corner radius
  float thick = 0.02;  // thickness
  float intensity = roundedFrame (pos, size, radius, thick);
  const vec3 rect1Color = vec3(1, 0.8, 0.3);
  col = mix(col, rect1Color, intensity);
        
  //--- rounded rectangle ---
  pos.x -=  + 0.08*sin(time);
  size *= 0.6; 
  radius *= 0.6;
  thick *= 0.6;
  intensity = roundedRectangle (pos, size, radius, 0.014);
  const vec3 rect2Color = vec3(0.5, 0.5, 0.8);
  col = mix(col, rect2Color, intensity);
	
  gl_FragColor = vec4(col, 1.0); 
}