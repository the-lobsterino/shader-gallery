//----------------------------------------------------------
// PatternStorm.glsl                              2016-02-13
// move mouse and stop it after pixel starts drawing
// wait until pattern whirling motion stop
// at the end ... is this a random pattern ?
//----------------------------------------------------------

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void )
{
  if (resolution.y - gl_FragCoord.y < 1. || gl_FragCoord.y < 1.
   || resolution.x - gl_FragCoord.x < 1. || gl_FragCoord.x < 1.) 
  {
    gl_FragColor = vec4(0.1);
    return;
  }
  if (length(gl_FragCoord.xy - mouse.xy*resolution.xy) <= 0.5) 
  {
    gl_FragColor = vec4(0.15);
    return;
  }	
  float c = 0.0;
  c += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-2., -1.))/resolution.xy).y;
  c += texture2D(backbuffer, (gl_FragCoord.xy + vec2(1., -2.))/resolution.xy).x;
  c = mod(c, 1.1);
  c -= texture2D(backbuffer, (gl_FragCoord.xy + vec2(2.8/c, c))/resolution.xy).x;
	
  // alive
  float alive = texture2D(backbuffer, gl_FragCoord.xy).x;
  if (alive <= 0.1) 
    gl_FragColor = vec4(vec3(c), 1.);	
}