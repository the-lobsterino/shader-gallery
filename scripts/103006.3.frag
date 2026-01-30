#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix(mix(dot(i + vec2(0.0, 0.0), vec2(127.1, 311.7)),
                   dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7)), u.x),
               mix(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7)),
                   dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7)), u.x), u.y);
}

float worley(vec2 st, float zoom, float time) {
  vec2 i = floor(st * zoom);
  vec2 f = fract(st * zoom);
  float minDist = 1.0;
  float secondMinDist = 1.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
	float a = i.y;
	float b = i.x;
      vec2 offset = vec2(float(x), float(y));
      vec2 neighbor = vec2(b + float( x), a +float( y));
      vec2 point = fract(neighbor + noise(neighbor + vec2(time)) * 1.1);

      float dist = length(point - f + offset);
      if (dist < minDist) {
        secondMinDist = minDist;
        minDist = dist;
      } else if (dist < secondMinDist) {
        secondMinDist = dist;
      }
    }
  }

  return minDist - secondMinDist;
}
// 2D Perlin noise function


void main() {
  vec2 position = (gl_FragCoord.xy / resolution.xy) - 0.5;
  position.x *= resolution.x / resolution.y;
  
  // add distortion
  vec2 distortion = vec2(noise(vec2(position.x * 1.0, position.y * 10.0 + time * 0.00001)),
                         noise(vec2(position.y * 1.0, position.x * 10.0 + time * 0.00001)));
	
  position += distortion * 0.01;
  
  // calculate distance from mouse position
  vec2 center = mouse - vec2(0.5,0.5);
  float dist = worley(position + vec2(time * 0.2 * mouse.y, 1), 2.0, time * 0.001*(mouse.x));;
  
  float angle = atan(position.y - center.y, position.x - center.x);
  float radius = dist * 3.0;
  float color = (sin(radius * 2.0 + time * 1.0) + 1.0) / 2.0;
  
  vec3 rainbow = vec3(1.0, 0.0, 0.0);
  rainbow.r = max(sin(angle * 30.0), 0.5);
  rainbow.g = max(sin(angle * 30.0 + 2.0), 0.5);
  rainbow.b = max(sin(angle * 30.0 + 2.0), 0.5);
  
  gl_FragColor = vec4(rainbow * color + 3.*(0.1,0.1,0.1), 1.0);
}
