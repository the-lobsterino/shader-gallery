// multifractal texture
// https://www.shadertoy.com/view/ltd3zH

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float Hash(vec2 p)
{
    float h = dot(p, vec2(17.1, 311.7));
    return -1.0 + 2.0 * fract(sin(h) * 4358.5453);
}

float Noise(vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(mix(Hash(i + vec2(0.0, 0.0)),
                   Hash(i + vec2(1.0, 0.0)), u.x),
               mix(Hash(i + vec2(0.0, 1.0)),
                   Hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float FbmNoise(vec2 p)
{
  const float octaves = 6.0;
  const float lacunarity = 2.0;
  const float H = 0.010;
  const float offset = 0.8;

  float value = 1.0;
  for (float i = 0.0; i < octaves; ++ i) {
    value *= (Noise(p) + offset) * pow(lacunarity, -H * i);
    p *= lacunarity;

  }
  return value;
}


void main()
{
  vec2 p = gl_FragCoord.xy / resolution.xy;
  vec2 uv = p*vec2(resolution.x / resolution.y,1.0);
  uv *= (2.0+sin(time*0.02));  // zoom anim
  gl_FragColor = vec4(vec3(FbmNoise(15.0 * uv )), 1.0) * vec4(0.2, 0.6, 0.8, 1.0);
}
