/* This code is part of an article, http://gpfault.net/posts/perlin-noise.txt.html */

/* Demonstrates generation of simple 1D perlin noise */


/* 
	Returns a gradient value for a given integer p.
	Gradients are 1 or -1 for 1D case.
	Gradients are read from a repeating texture containing
	random RGB values, with neares-neighbor filtering.
*/
	
float grad(float p) {
	const float texture_width = 256.0;
	float v = texture2D(iChannel0, vec2(p / texture_width, 0.0)).r;
    return v > 0.5 ? 1.0 : -1.0;
}

/* S-shaped curve for 0 <= t <= 1 */
float fade(float t) {
  return t*t*t*(t*(t*6.0 - 15.0) + 10.0);
}


/* 1D noise */
float noise(float p) {
  float p0 = floor(p);
  float p1 = p0 + 1.0;
    
  float t = p - p0;
  float fade_t = fade(t);

  float g0 = grad(p0);
  float g1 = grad(p1);

  return (1.0-fade_t)*g0*(p - p0) + fade_t*g1*(p - p1);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    const float frequency = 1.0 / 20.0;
    const float amplitude = 1.0 / 5.0;
    float n = noise(fragCoord.x * frequency) * amplitude;
    float y = 2.0 * (fragCoord.y/iResolution.y) - 1.0; /* map fragCoord.y into [-1; 1] range */
    vec3 color = n >  y ? vec3(1.0) : vec3(0.0);
	fragColor = vec4(color, 1.0);
}