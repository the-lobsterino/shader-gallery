// 150720N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



vec2 square(vec2 z)
{
	float x = z.x, y = z.y;
	return vec2(x * x - y * y, 2. * x * y);
}

float mandelbrot(vec2 c)
{
	int MAX_ITERATION = 120;
	
	vec2 z = c;
	float count = 0.0;
	
	for (int i = 0; i < 120; i++)
	{
		z = square(z) + c;
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}
	
	return (count / float(MAX_ITERATION));
}



void main(void){
	
	float t = time;
	vec2 m = mouse;
	vec2 r = resolution;
	
	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
	vec3 destColor = vec3(1.0, 0.25, 0.75);
	vec3 destForm = vec3(0.0);
	float f = 0.0001 / abs(p.x * p.y);
	for (float i = 0.0; i < 13.0; i++) {
		float jj = i + 1.0;
		float rr = mandelbrot(p);
		vec2 qq = p + vec2(cos(rr + t * jj * .3925), sin(rr + t * jj * .19625));
		float ff = 0.00025 / abs(qq.x * qq.y);
		destForm += vec3(ff);
	}
	gl_FragColor = vec4(vec3(destColor*destForm), 1.0);
}