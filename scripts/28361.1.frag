// Flower Matrix v2.1
// By: Brandon Fogerty
// ReMix / Edit by Harley...

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
  vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
  uv.x *= resolution.x/resolution.y;
	
  float a = 2.*atan( uv.y / uv.x );
  float r = length( uv );
  float t = abs( sin(((a + 2.0*sin(time)*r)*3.0))*0.6 );
    
  vec3 C = (1.0-r) * vec3( 28.0*t, 2.0*t, 1.0*t );
  C*= vec3( sin(a)*0.2, 0.75+0.25*cos(time), 1.0*r );
  gl_FragColor = vec4( C, 1.0 );
}