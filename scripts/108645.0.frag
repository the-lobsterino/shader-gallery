#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 uResolution;
uniform float uTime;

// LCD pixel properties
const float pixelSize = 0.002; // Adjust size for desired resolution

// Crack properties
float crackWidth = 0.01;
vec2 crackStart1 = vec2(0.3, 0.2);
vec2 crackEnd1 = vec2(0.7, 0.5);
vec2 crackStart2 = vec2(0.1, 0.8);
vec2 crackEnd2 = vec2(0.8, 0.4);

// Liquid crystal spill properties
float spillRadius = 0.02;
float spillAlpha = 0.5;
vec3 spillColor = vec3(1.0, 1.0, 1.0);

// Color banding properties
float bandWidth = 0.05;
vec3 bandColor1 = vec3(1.0, 0.7, 0.3);
vec3 bandColor2 = vec3(0.5, 0.9, 1.0);

// RGB streak properties
float streakWidth = 0.03;
vec3 streakColor1 = vec3(1.0, 0.0, 0.0);
vec3 streakColor2 = vec3(0.0, 1.0, 0.0);
vec3 streakColor3 = vec3(0.0, 0.0, 1.0);

void main() {
  // Calculate pixel coordinates
  vec2 pixelCoord = gl_FragCoord.xy / uResolution;
  vec2 pixelCenter = floor(pixelCoord / pixelSize) * pixelSize + pixelSize / 2.0;

  // Calculate distance to cracks
  float distance1 = distance(pixelCenter, crackStart1 + (crackEnd1 - crackStart1) * uTime);
  float distance2 = distance(pixelCenter, crackStart2 + (crackEnd2 - crackStart2) * uTime);

  // Apply crack effect
  float crackMask = smoothstep(0.0, crackWidth, distance1) + smoothstep(0.0, crackWidth, distance2);
  float alpha = mix(1.0, 0.0, crackMask);

  // Apply liquid crystal spill
  float spillMask = smoothstep(0.0, spillRadius, distance1) + smoothstep(0.0, spillRadius, distance2);
  vec3 spill = mix(spillColor, vec3(0.0), spillMask * spillAlpha);

  // Apply color banding
  float bandIndex = floor(mod(pixelCoord.y, bandWidth) / bandWidth);
  vec3 bandColor = mix(bandColor1, bandColor2, bandIndex);

  // Apply RGB streaks
  float streakMask1 = smoothstep(0.5 - streakWidth / 2.0, 0.5 + streakWidth / 2.0, pixelCoord.x);
  float streakMask2 = smoothstep(0.5 - streakWidth / 2.0, 0.5 + streakWidth / 2.0, 1.0 - pixelCoord.y);
  vec3 streakColor = mix(
      bandColor,
      mix(streakColor1, streakColor2, streakMask1),
      streakMask2
  );

  // Combine effects and output
  gl_FragColor = vec4(mix(spill + streakColor, bandColor, alpha), 1.0);
}