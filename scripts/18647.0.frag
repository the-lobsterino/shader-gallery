
precision highp float;
uniform vec2 resolution;
void main( void )
{
      float x = ( 1.0 - ( gl_FragCoord.x / resolution.x ));

      float y = ( gl_FragCoord.y / resolution.y ) * 26.0;
      float yp = pow( 2.0, floor(y) );
      float fade = fract( yp + fract(x) );
      if(fract(y) < 0.9)
          gl_FragColor = vec4( vec3( fade ), 1.0 );
    else
          gl_FragColor = vec4( 0.0 );
}