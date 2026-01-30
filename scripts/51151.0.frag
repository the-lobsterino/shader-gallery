// Youi Labs GPU precision shader (slightly modified)
// from
// https://community.arm.com/graphics/b/blog/posts/benchmarking-floating-point-precision-in-mobile-gpus

uniform highp vec2 resolution;

void main( void )
{
  highp vec2 r1 = resolution;
  highp vec2 c1 = gl_FragCoord.xy;
  highp float y1 = (1.0 - c1.y / r1.y ) * 26.0;
  highp float x1 = 1.0 - ( c1.x / r1.x ); 
  highp float b1 = fract( pow( 2.0, floor(y1) ) + x1 );
  if(fract(y1) >= 0.9) {
    b1 = 0.0;
  }

  mediump vec2 r2 = resolution;
  mediump vec2 c2 = gl_FragCoord.xy;
  mediump float y2 = (1.0 - c2.y / r2.y ) * 26.0;
  mediump float x2 = 1.0 - ( c2.x / r2.x ); 
  mediump float b2 = fract( pow( 2.0, floor(y2) ) + x2 );
  if(fract(y2) >= 0.9) {
    b2 = 0.0;
  }

  lowp vec2 r3 = resolution;
  lowp vec2 c3 = gl_FragCoord.xy;
  lowp float y3 = (1.0 - c3.y / r3.y ) * 26.0;
  lowp float x3 = 1.0 - ( c3.x / r3.x ); 
  lowp float b3 = fract( pow( 2.0, floor(y3) ) + x3 );
  if(fract(y3) >= 0.9) {
    b3 = 0.0;
  }


  gl_FragColor = vec4(b1, b2, b3, 1.0 );
}
