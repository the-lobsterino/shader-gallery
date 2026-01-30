#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
uniform float time;

void main( void ) {

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec2 z = vec2( 0, 0 ); 
  vec2 z_ = vec2( 0, 0 ); 
  vec2 c = p.xy;      
  bool diverge = false;     
  int j = 0;

  for ( int i = 0; i < 3000; i ++ ) {
	  j++;
    z_.x = z.x*z.x -  z.y* z.y;
    z_.y = 2.*z.x * z.y;
    z = z_ + c;
    if ( length( z ) > 2. ) {
      diverge = true;
      break;
    }
  }
  
   if( diverge ) {
    //gl_FragColor = vec4( mod( float( j ), abs(sin(time))*5. ), float( j )*p.x, float( j )*p.y, 1. );
	   gl_FragColor = vec4(cos(time), cos(time), cos(time), 1.);
  } else {
    gl_FragColor = vec4(sin(time), sin(time), sin(time), 1. );
  }	
}