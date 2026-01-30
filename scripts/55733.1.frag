#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec2 size;

float rand(float x, float t)
{
  return fract(sin(dot(vec2(x, t), vec2(12.9898, 4.1414))) * 43758.5453);
}

vec4 Particle(vec2 uv, float particle, vec4 color, vec4 startColor, vec4 endColor, vec2 start, vec2 end, float frame, float size)
{
  vec2 diff = end - start;
  vec2 position = start + (diff * frame);
  float particleDistance = dot(position - uv, position - uv);

  if (particleDistance < size) {
    float fade = (1.0 - frame);
    vec4 particleColour = mix(startColor, endColor, frame) * (sin(frame * 50.0 + particle) + 2.0);
    
    color = mix((particleColour * fade), color, smoothstep(0.0, size, particleDistance));
  }

  return color;
}

void main()
{
  vec2 uv = gl_FragCoord.xy / min(resolution.x, resolution.y);
  vec2 origin = mouse * resolution / min(resolution.x, resolution.y);

  const float PI = 3.14159265;
  float size = 0.000075;
  float radius = 1.0;
  vec4 color  = vec4(0.0);
  vec4 cStart = vec4(1.0, 0.5, 0.04, 1.0);
  vec4 cEnd   = vec4(0.8, 0.3, 0.02, 1.0);

  for (float i = 1.0; i < 50.0; ++i) {
    float rnd1 = rand(floor(time), i);
    float rnd2 = rand(floor(time), 1.0 / i) * 0.9 + 0.1;
    vec2 target = origin + vec2(cos(rnd1 * PI * 2.0), sin(rnd1 * PI * 2.0)) * rnd2 * radius;
    color = Particle(uv, i, color, cStart, cEnd, origin, target, mod(time, 1.0), size - rnd2 * size);
  }
  
  gl_FragColor = color;
}