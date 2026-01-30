#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

// Classic Perlin 2D Noise
// by Stefan Gustavson
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}


void main() {
    vec2 position = gl_FragCoord.xy / resolution.xy; // Normalized coordinates

    vec3 leakingColor = vec3(0.0, 0.67, 0.82); // Hex 00aad2
    vec3 creamColor = vec3(1.0, 0.98, 0.9); // Cream background color
    vec3 darkBlueColor = vec3(0.0, 0.18, 0.37); // Hex 002c5f

    // Calculate noise based on position and time
    float noise = snoise(position * 5.0 + vec2(time * 0.5, time * 0.5));

    // Calculate time factor to control the movement of light up and down
    float timeFactor = (sin(time * 0.75) * 0.5 + 0.5) * 0.3;

    // Calculate the light leak effect
    float lightLeak = smoothstep(-0.3, 0.3, position.x - (0.16 + timeFactor) + noise * 0.05);

    // Mix the leaking color and the cream background based on the lightLeak value
    vec3 finalColor = mix(mix(darkBlueColor, leakingColor, lightLeak), creamColor, lightLeak);

    // Add subtle film grain-like noise to the final image
    float grain = snoise(position * 150.0 + vec2(time * 0.1, time * 0.1)) * 0.015;
    finalColor += grain;

    gl_FragColor = vec4(finalColor, 1.0);
}