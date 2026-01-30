//----------------------------------------------------------
// PatternStorm.glsl                              2016-02-13
// colorized by I.G.P.
// move mouse and stop it after pixel starts drawing
// wait until pattern whirling motion stop
// at the end ... is this a random pattern ?
//----------------------------------------------------------

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const vec4 BLUE = vec4( 0.0, 0.1, 0.35, 1.0 );
const vec4 BLUET = vec4( 0.1, 0.2, 0.4, 1.0 );
const vec4 TEAL = vec4( 0.25, 0.4, 0.55, 1.0);
const vec4 TEALG = vec4( 0.8, 0.55, 0.25, 1.0);
const vec4 GREEN = vec4( 0.9, 0.70, 0.25, 1.0 );
const vec4 GREENY = vec4( 0.2, 0.3, 0.15, 1.0 );
const vec4 YELLOW = vec4( 0.2, 0.5, 0.25, 1.0);
const vec4 YELLOWR = vec4( 0.3, 0.5, 0.65, 1.0);
const vec4 RED = vec4( 0.25, 0.45, 0.5, 1.0 );
const vec4 REDP = vec4( 0.25, 0.45, 0.75, 1.0 );
const vec4 PURPLE = vec4( 0.3, 0.55, 0.9, 1.0 );

float remap(float minval, float maxval, float curval)
{   return (curval - minval)/(maxval - minval);   }

void colorize( float swell )
{
  if     (swell < 0.25)  gl_FragColor = mix(BLUE,BLUET,remap(0.2,0.25,swell));
  else if(swell < 0.30)  gl_FragColor = mix(BLUET,TEAL,remap(0.25,0.3,swell));
  else if(swell < 0.35)  gl_FragColor = mix(TEAL,TEALG,remap(0.3,0.35,swell));
  else if(swell < 0.40)  gl_FragColor = mix(TEALG,GREEN,remap(0.35,0.4,swell));
  else if(swell < 0.45)  gl_FragColor = mix(GREEN,GREENY,remap(0.4,0.45,swell));
  else if(swell < 0.50)  gl_FragColor = mix(GREENY,YELLOW,remap(0.45,0.5,swell));
  else if(swell < 0.55)  gl_FragColor = mix(YELLOW,YELLOWR,remap(0.5,0.55,swell));
  else if(swell < 0.60)  gl_FragColor = mix(YELLOWR,RED,remap(0.55,0.6,swell));
  else if(swell < 0.65)  gl_FragColor = mix(RED,REDP,remap(0.6,0.65,swell));
  else                   gl_FragColor = mix(REDP,PURPLE,remap(0.65,0.7,swell));
}

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
	
  colorize(c+0.02);
}