/*
 * Original shader from: https://www.shadertoy.com/view/XsfBzj
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// == defines ==================================================================
#define BITS 16.0
#define THR 0.5
#define LOOPFREQ 2.0
#define SCALE (iResolution.y * 0.1)
#define VIG 0.0

#define PI 3.14159265
#define saturate(x) clamp(x,0.,1.)
#define linearstep(a,b,x) saturate((x-a)/(b-a))

// == vec2 to float hash =======================================================
float random2( vec2 co ) {
  return fract( sin( dot( co.xy, vec2( 2.9898, 7.233 ) ) ) * 4838.5453 );
}

// == main procedure ===========================================================
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 p = ( fragCoord.xy * 2.0 - iResolution.xy ) / iResolution.y;

  float radius = length( p ) * SCALE;
  float layerI = floor( radius );
  
  if ( layerI < 2.0 ) {
    fragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
    return; // fast return
  }

  float ssThr = 2.0 / iResolution.y; // threshold of smoothstep
  float theta = ( atan( p.y, p.x ) + PI ) / 2.0 / PI;

  // make "ring"s
  float layerF = fract( radius );
  float ring = linearstep( 0.0, ssThr * SCALE, layerF );
  ring *= 1.0 - linearstep( 0.0, ssThr * SCALE, layerF - 0.3 );

  // define spinning velocity
  float vel = 0.05 * ( random2( vec2( layerI, 3.155 ) ) - 0.5 );

  // define number of segments
  float seg = 1.0 + floor( layerI * 4.0 * pow( random2( vec2( layerI, 2.456 ) ), 2.0 ) );

  // define seeds
  float phase = fract( ( theta + iTime * vel ) * LOOPFREQ ) * seg;
  float seed = floor( phase ); // seed of current segment
  float seedN = mod( seed + 1.0, seg ); // seed of next segment

  // calcurate state by seed and random
  float stateI = random2( vec2( layerI, seed ) ) < THR ? 0.0 : 1.0;
  float stateIN = random2( vec2( layerI, seedN ) ) < THR ? 0.0 : 1.0;

  // make gradient for next segment
  float state = mix(
    stateI,
    stateIN,
    linearstep( 0.0, ssThr / length( p ) * seg / PI, fract( phase ) )
  );

  // final destination
  fragColor = vec4( vec3( state * ring ), 1.0 );
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}