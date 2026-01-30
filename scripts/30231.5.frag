// https://jaksa.wordpress.com/2014/09/02/writing-a-parallel-sort-on-glsl-heroku-com/
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buffer;

float hash(float x, float y) {
   return fract(sin(dot(vec2(x, y) ,vec2(12.9898,78.233))) * 43758.5453);
}

float grad(float x, float y) {
   return (resolution.y - y + resolution.x - x) / (resolution.x + resolution.y);
}

// the previous value at column x
vec4 prev(float x, float y) {
   return texture2D(buffer, vec2((x + .5) / resolution.x, y / resolution.y));
}

bool odd(float x) {
   return (mod(x, 2.0) < 1.0);
}

// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 rgb2hsv(vec4 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

float hsv_sum(vec3 hsv)
{
	return (hsv.x * 4.0) + (hsv.y * 2.0) + hsv.z;
}

bool compare(vec4 a, vec4 b)
{
	return hsv_sum(rgb2hsv(a)) <= hsv_sum(rgb2hsv(b));
}

vec4 min_pixel(vec4 a, vec4 b)
{
	return !compare(a, b) ? a : b;
}

vec4 max_pixel(vec4 a, vec4 b)
{
	return compare(a, b) ? a : b;
}

vec4 sort(float x, float y) {
   if (odd(x) ^^ odd(time * 200.)) {
      return min_pixel(prev(x + 1.0, y), prev(x, y));
   } else {
      return max_pixel(prev(x, y), prev(x - 1.0, y));
   }
}

void main( void ) {
   float x = floor(gl_FragCoord.x);
   float y = floor(gl_FragCoord.y);
   if (mouse.x > .5) {
	   float r = hash(x, y + time);
	   float g = hash(x + time, y);
	   float b = hash(x + time, y + time);
	   gl_FragColor = vec4(r, g, b, 1.0);
   }
   else {
	   gl_FragColor = sort(x, y);
   }
}