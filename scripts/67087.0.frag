#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2      resolution;
uniform float     time;
uniform float     alpha;
uniform vec2      speed;
uniform float     shift;


float rand(vec2 n) {
  //This is just a compounded expression to simulate a random number based on a seed given as n
      return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
  //Uses the rand function to generate noise
      const vec2 d = vec2(0.0, 1.0);
      vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
      return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
  //fbm stands for "Fractal Brownian Motion" https://en.wikipedia.org/wiki/Fractional_Brownian_motion
      float total = 0.0, amplitude = 1.0;
      for (int i = 1; i < 4; i++) {
        total += noise(n) * amplitude;
        n += n;
        amplitude *= 0.5;
      }
      return total;
}

#define timeMultiplier 0.4
void main() {
    //This is where our shader comes together
    const vec3 c1 = vec3(180.0/255.0, 255.0/180.0, 140.0/180.0);
    const vec3 c2 = vec3(0.0/155.0, 0.0/155.0, 120.4/120.0);
    const vec3 c3 = vec3(80.2, 0.0, 0.0);
    const vec3 c4 = vec3(0.0/0.0, 120.0/255.0, 120.4/120.0);
    const vec3 c5 = vec3(0.6);
    const vec3 c6 = vec3(0.3);

    //This is how "packed" the smoke is in our area. Try changing 8.0 to 1.0, or something else
    vec2 p = gl_FragCoord.xy * 19.0 / resolution.xx;
    //The fbm function takes p as its seed (so each pixel looks different) and time (so it shifts over time)
    float q = fbm(p - time * timeMultiplier);
    vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));
	
    const vec3 c111 = vec3(0.0, 225.0/255.0, 180.0/255.0);
	
	//color
    vec3 c = mix(c111, c111, c111) + mix(c3+4.5, c4-0.8, r.x) - mix(c5, c6, r.y);
	
	//gradient
    float grad = gl_FragCoord.y / resolution.y;
	
	//sets the fragment
    gl_FragColor = vec4(c * cos(shift * gl_FragCoord.y / (resolution.y)) * sin((gl_FragCoord.x * time)/-0.1)/cos((gl_FragCoord.y * time)/-0.1), 1.0);
    gl_FragColor.xyz *= (1.0-grad);
}