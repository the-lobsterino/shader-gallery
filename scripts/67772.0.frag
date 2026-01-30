#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float count = 1112.0;

float Hash( vec2 p, in float s)
{
  vec3 p2 = vec3(p.xy,27.0 * abs(sin(s)));
  return fract(sin(dot(p2,vec3(27.1,61.7, 12.4)))*273758.5453123);
}

float noise(in vec2 p, in float s)
{
  vec2 i = floor(p);
  vec2 f = fract(p);
  f *= f * (3.0-2.0*f);

  return mix(mix(Hash(i + vec2(0.,0.), s), Hash(i + vec2(1.,0.), s),f.x),
      mix(Hash(i + vec2(0.,1.), s), Hash(i + vec2(1.,1.), s),f.x),
      f.y) * s;
}

float fbm(vec2 p)
{
  float v = 0.0;
  v += noise(p*1., 0.35);
  v += noise(p*2., 0.25);
  v += noise(p*4., 0.125);
  v += noise(p*8., 0.0625);
  return v;
}

void main( void ) {
    vec4 o = vec4(1, 1, 1, 1);
    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.45;
    vec2 mouse = mouse.xy;
    uv.x *= resolution.x/resolution.y;
    vec3 finalColor = vec3( 0 );
    for( float i=1.; i < 5.; ++i ) {
        float t = abs(1.0 / ((uv.x + fbm(uv + resolution*(i+uv/512.) + time/i)) * (i*50.0)));
        finalColor +=  t * vec3( i * 1.075 +0.1, 0.5, 2.0 ) * 0.2;
    }
    float alpha = 1.0;
    vec3 black = vec3(0.0);
    if(finalColor.r < 0.01 && finalColor.g < 0.05 && finalColor.b < 0.05) {
        alpha = 1.0;
    }
    gl_FragColor = vec4( finalColor, alpha );
}