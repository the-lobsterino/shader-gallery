// 250720N INTERFERENCES WITH THE MANDELBROT SET FORMULA
//	stay a while - the output will change!!

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// 230720N
// https://www.youtube.com/watch?v=yxNnRSefK94



/*
#define MAX_ITERATION 10
float mandelbrot(vec2 c, out vec2 z)
{
	
	float count = 0.0;
	for (int i = 0; i < MAX_ITERATION; i++)
	{
		z = vec2((z.x*z.x - z.y*z.y), (2.0 * z.x * z.y)) + c;
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}
	
	return (count / float(MAX_ITERATION));
}*/


#define MAX_ITERATION 15.

float map(vec3 p) {
	
	vec2 c = vec2(0.5,0.5);
	vec3 v = vec3(0.);
	for(float i=0.0;i<MAX_ITERATION;i+=1.0) {
		v += vec3(p.x*p.x - p.y*p.y, 2.0 * p.x * p.y + c);
		if (length(v) > 2.0) break;
	}
	v /= MAX_ITERATION;
	
	vec3 q = fract(v) - .5;
	float r = length(q) - 0.25;
	
	r = clamp(r, 0.01, 0.2);
	//r = smoothstep(0.1, .1, r);
	return r;
}

float trace(vec3 o, vec3 r) {
	float t = 0.0;
	for (int i=0;i<64;++i) {
		vec3 p = o+r*t;
		float d = map(p);
		t += d*0.5;
	}
	return t;
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	uv = uv*2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	vec3 r = normalize(vec3(uv, 1.0));
	
	float the = time * 0.25;
	r.xz *= mat2(cos(the), -sin(the), sin(the), cos(the));
	vec3 o = vec3(0.0, time, time);
	
	float t = trace(o,r);
	float fog = 1.0 / (1.0 + t*t*0.1);
	vec3 fc = vec3(fog);
		
	gl_FragColor = vec4( fc, 1.0 );

}