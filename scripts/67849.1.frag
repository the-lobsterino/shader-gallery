	// N220920N Greetings from Mr. Fourier
	// N220920N Greetings from Mr. Mandelbrot
	// N240920N Hello from Julia


	#ifdef GL_ES
	precision mediump float;
	#endif
	
		
	precision mediump float;
	uniform float time;
	uniform vec2 resolution;
	uniform vec2 mouse;


	#define MAX_ITERATION 120.
	float mandelbrot(vec2 v)
	{
		vec2 c = vec2( 0.285+mouse.x, 0.01+mouse.y);
		vec2 z = v;
		float count = 0.0;
		float t = time*0.2;
		for (float i = 0.0; i < MAX_ITERATION; i++)
		{
			z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) - c;
			if (length(z) > 2.0) break;
			
			count += 1.0;
		}
	
		float re = (length(z*count/MAX_ITERATION));
		if (re <= 0.0)
			return 1.;
		return re;
	}


	void main(void){
	
	
	vec2 p =(gl_FragCoord.xy *2.0 -resolution);
	p /= min(resolution.x,resolution.y);

	float a = sin(p.x *100. -time*0.2)/1.0 ;

	float e = 0.01/abs(p.y+a);
	
	float mb = mandelbrot(vec2(p.x, p.y+e));
		
	vec3 rColor =vec3(mb,mb,e*mb);
	vec3 destColor = rColor*mb;
	gl_FragColor =vec4(destColor,1.0);
}