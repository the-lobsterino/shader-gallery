#ifdef GL_ES 
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


#define TAU 8.0
#define MAX_ITER 16
uniform float time;
uniform vec2 resolution;

void main()
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    vec2 p = mod(uv*TAU, TAU)-200.0;
	vec2 i = vec2(p);
	float c = .5;
	float inten = .005;
	vec3 cc = vec3(.5);

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = 0.204*(time+23.0) * (1.0 - (3.0 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		cc.r += 1.0/length(vec2(p.x / (sin(i.x+t)/inten), p.y / (sin(i.y-t)/inten)));
		cc.g += 0.8/length(vec2(p.y / (cos(i.x+t)/inten), p.x / (cos(i.y+t)/inten)));
		cc.b += 0.6/length(vec2(p.x / (atan(i.x+t)/inten), p.y / (sin(i.y-t)/inten)));
	}
	cc /= float(MAX_ITER);
	cc = 1.0-pow(cc, vec3(2.25));
	vec3 colour = pow(abs(cc), vec3(12.0));
	colour = clamp(colour, 0.0, 1.0);
	gl_FragColor = vec4(colour, 1.0);
}