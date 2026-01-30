// Sparkle Shader

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

  // calculate the sparkle position based on the mouse position
  vec2 sparklePos = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

  // calculate the sparkle color based on the time and sparkle position
  float sparkleColor = 0.0;
  sparkleColor += sin( sparklePos.x * cos( time / 15.0 ) * 80.0 ) + cos( sparklePos.y * cos( time / 15.0 ) * 10.0 );
  sparkleColor += sin( sparklePos.y * sin( time / 10.0 ) * 40.0 ) + cos( sparklePos.x * sin( time / 25.0 ) * 40.0 );
  sparkleColor += sin( sparklePos.x * sin( time / 5.0 ) * 10.0 ) + sin( sparklePos.y * sin( time / 35.0 ) * 80.0 );
  sparkleColor *= sin( time / 10.0 ) * 0.5;

  // set the fragment color to the sparkle color
  gl_FragColor = vec4( vec3( sparkleColor, sparkleColor * 0.5, sin( sparkleColor + time / 3.0 ) * 0.75 ), 1.0 );

}
