#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
varying vec2 surfacePosition;

float sprite_pattern(vec2 uv,float t,float A,float B,float C,float D,float E,float F,float G)
{
  uv = (uv*uv*D - t - E);
  return step(mod(floor(uv.x)+floor(uv.y), 1.0+mod(t*G,B)*C),F);
}

vec4 sprite(vec2 uv,float t,float A,float B,float C,float D,float E,float F,float G,float H)
{
  vec4 rgba = vec4(1.0);

  for ( float i = 0.0; i < 4.0; i++ ) {

    rgba.r = sprite_pattern( uv,t+i*H,A,B,C,D,E,F,G);
    rgba = rgba.gbar;

  }
	
  return rgba;
}

void main( void ) 
{
  vec2 uv = surfacePosition;//(gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x,iResolution.y);

  uv = uv * 2.0;

  float t = fract(dot(uv,uv)*0.01)*0.0005;

  vec2 m = vec2( sin(t), cos(t) ) * 0.005;

  vec2 suv = floor((uv*13.0+floor(m.xy))*2.0);

  vec4 rgba = sprite(
    suv,t,10.0,2.0,9.0,10.0,2.0,0.25,0.125, 0.015
  );

  if ( uv.x < 0.0 ) { rgba.rgb = rgba.gbr; }
  
  gl_FragColor = vec4( normalize(rgba.rgb * (1.0-rgba.a))*4.0, 1.0 );
}
