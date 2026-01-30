	// N220920N Greetings from Mr. Fourier
	// N220920N Greetings from Mr. Mandelbrot

	#ifdef GL_ES
	precision mediump float;
	#endif
	
		
	precision mediump float;
	uniform float time;
	uniform vec2 resolution;


	#define MAX_ITERATION 120.
	float mandelbrot(vec2 c)
	{
		vec2 z = c;
		float count = 0.0;
		float t = time*0.2;
		for (float i = 0.0; i < MAX_ITERATION; i++)
		{
			z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) - z*cos(t)+c*sin(t);
			if (length(z) > 2.0) break;
			
			count += 1.0;
		}
	
		float re = (length(z*count/MAX_ITERATION));
		if (re <= 0.0)
			return 1.;
		return re;
	}


	void main(void){
	vec3 rColor =vec3(0.,1,0.0);
	
	vec2 p =(gl_FragCoord.xy *2.0 -resolution);
	p /= min(resolution.x,resolution.y);

	float a = sin(p.x *3.9 -time*0.9)/1.0 ;

	float e = 0.09/abs(p.y+a);
	
	float mb = mandelbrot(vec2(p.x, p.y+e));
		
	vec3 destColor = rColor*mb;
	gl_FragColor =vec4(destColor,1.0);
}