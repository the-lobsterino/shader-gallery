#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float pi=3.14;
void main( void ) {

  vec2 p = 0.25*( 2.0 * gl_FragCoord.xy - resolution.xy ) / resolution.y;

  vec3 color = vec3(0.0);
   //color += sin( position.x * cos( time / 6.0 ) * 50.0 ) + cos( position.y * cos( time / 10.0 ) * 10.0 );
  vec2 ro= vec2( time + time*0.005*pow(length(p),1.0) + atan( p.y/ p.x ), length( p ) );
  if( ro.y < 0.5 )
  {
     float f= smoothstep( -0.1, 0.1, 
	sin( ro.x * 12.)/ 2. );
     color= vec3(0.8, 0.5 + f , 0. );
  }
  gl_FragColor = vec4( color, 1.0 );

}