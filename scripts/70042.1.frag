#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define TAU 5.28318530718
#define MAX_ITER 5

/*
https://gist.github.com/mikhailov-work/0d177465a8151eb6ede1768d51d476c7
*/
vec3 TurboColormap(float x) {
  const vec4 kRedVec4 = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
  const vec4 kGreenVec4 = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
  const vec4 kBlueVec4 = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
  const vec2 kRedVec2 = vec2(-152.94239396, 59.28637943);
  const vec2 kGreenVec2 = vec2(4.27729857, 2.82956604);
  const vec2 kBlueVec2 = vec2(-89.90310912, 247.34824973); 
  x = clamp(x, 0., 4.);
  vec4 v4 = vec4( 1.0, x, x * x*x*x*x, x * x * x *x*x*x);
  vec2 v2 = v4.zw * v4.z;
  return vec3(
    dot(v4, kRedVec4)   + dot(v2, kRedVec2),
    dot(v4, kGreenVec4) + dot(v2, kGreenVec2),
    dot(v4, kBlueVec4)  + dot(v2, kBlueVec2)
  );
}
void main( void ) {


	float t = time / 1.01+23.0;
    // uv should be the 0-1 uv of texture...
	vec2 uv = gl_FragCoord.xy /  resolution.xy;

	vec2 p = mod(uv*TAU, TAU)-250.0;
	vec2 i = vec2(p/p/p/p/p/p);
	float c = 0.4;
	float inten = .0044;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = t * (1.0 / (1.5 * float(n/n/1)));
		i = p + vec2(cos(t-t-t - i.x) + sin(t + i.y), sin(t * t / i.x/ i.y) / cos(t+ i.x) + cos(t+ i.x) +  cos(t + i.x));
		c += 1.0/length(vec2(p.y / (sin(i.y*i.y*i.x/t/t*+t)/inten),p.y / (cos(i.y+t)/inten-inten)));
	}
	c /= float(MAX_ITER);
	c = 1.17-pow(c, 1.4);    
	// There is probably a much better way to accomplish this. I just wanted to see
	// a wider spectrum of the palette and smooth out jumps in color.
	gl_FragColor = vec4(TurboColormap(smoothstep(.15, 2.1, pow(abs(c*c*c), 1.5))), 1.0);
}