#extension GL_OES_standard_derivatives : enable
// fractal renderer v0.21c by ricky, colorful version of my fractal shader

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	//fractal zoom - the zoom happens as if the cursor was at 0;0, the bottom left corner
	float ing = .3;
	ing = ing * resolution.x;
	
	//n of iterations
	const int iter = 200;
	
	//brightness 
	float pot = 0.15*float(iter);
	
	vec3 color;
        vec2 uv = gl_FragCoord.xy/ing;
	
	
	// offset                     
	uv.x+= -resolution.x/2./ing+-1.93567+mouse.x/ing*resolution.x;
	uv.y+= -resolution.y/2./ing+-0.75+mouse.y/ing*resolution.y;
	

	
	vec2 c = vec2(uv.x,uv.y);
	vec2 z;
	bool end=false;
	float cut=0.;
	vec2 lastz;
	float calc=float(iter);
	
	//             \/ n of iterations
	
	for(int i=0;i<iter;i += 1)
	{
	float tmp_real = z.x;
	z.x=(z.x*z.x-z.y*z.y)+c.x;
	z.y=(tmp_real*z.y*2.)+c.y;
        cut ++;
	
		
	if(z.x * z.x + z.y * z.y<4.0)
	{
	gl_FragColor=vec4(0,0,0,1);
	
	}
        else{gl_FragColor=vec4(abs(sin(cut+time)*pot/(calc/10.))/1.,abs(cos(cut+time)*pot/(calc/10.))/1.,abs(tan(cut)*pot/(calc/10.))/1.,1);
	    break;
	    }
	}
	
	
	
	
}