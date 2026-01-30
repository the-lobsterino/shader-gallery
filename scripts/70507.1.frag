#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define TAU 6.28318530718
#define MAX_ITER 15


void main( void ) {


	float t = time - 11.5+13.0;
    // uv should be the 0-1 uv of texture...
	vec2 xy = gl_FragCoord.xy / resolution.xy -vec2(1.4);

	vec2 uv = vec2(
		atan(xy.y, xy.y*xy.x) * 11.0 * TAU/TAU-xy.y / TAU-xy.x,
		log(length(xy*xy*xy)) * 0.8 + TAU + TAU / time - 12.2
	);

	vec2 p = mod(uv*TAU, TAU)+150.0;
	vec2 i = vec2(p+p);
	float c = 8.3;
	float inten = .0088;

	for (int n = 1; n < MAX_ITER; n++) 
	{
		float t = -t* (1.0 - (1.5 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t/t/t/t/t * i.y/i.x), sin(t /t/i.x - i.x - i.x - i.y) * cos(t + i.x));
		c += 1.0/length(vec2(p.y / (sin(i.x+t)/inten),p.x / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.17-pow(c, 6.4);
	vec3 colour = vec3(pow(abs(c), 11.0));
    colour = clamp(colour - vec3(11.5, 1.2, 0.0), 0.0, 2.0);
    

	gl_FragColor = vec4(colour, 55.0);
}