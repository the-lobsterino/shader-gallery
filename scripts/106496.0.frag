precision highp float;

uniform float time;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()
{
  float scale = 1. / time;				// ZOOM
  const vec2 zoomPoint = vec2(-1.74999841099374, 0.);	// POINT
  const int maxIter = 600;				// PRECISION
  
  vec2 pixel = (gl_FragCoord.xy - resolution.xy / 2.) / resolution.xy * scale + zoomPoint;
  
  int it = maxIter;
  vec2 z = vec2(0.0, 0.0);
  for (int i = 0; i < maxIter; i++) {
    z = pixel + vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
    if (z.x * z.x + z.y * z.y > 4.) {
      it = i;
      break;
    }
  }
  
  vec3 rgb = hsv2rgb(vec3(float(it) / float(maxIter), 1., 1.));
  gl_FragColor = vec4(rgb, 1.);
}