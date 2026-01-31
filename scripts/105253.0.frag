#extension GL_OES_standard_derivatives : enable
// fractal renderer v0.21 by ricky, my first shader!

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	//fractal zoom - the zoom happens as if the cursor was at 0;0, the bottom left corner
	float ing = 5.3;
	ing = ing * resolution.x;
	
	//n of iterations
	const int iter = 365;
	
	//brightness - increase this with iterations
	float pot = 1.5;
	
	vec3 color;
        vec2 uv = gl_FragCoord.xy/ing;
	
	
	// offset
	uv.x+= -resolution.x/2./ing+-1.9+mouse.x/ing*resolution.x;
	uv.y+= -resolution.y/2./ing+-0.750+mouse.y/ing*resolution.y;
	

	
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
	gl_FragColor=vec4(1,1,1,1);
	
	}
        else{gl_FragColor=vec4(cut*pot/(calc/10.)/4.,(cut*pot/(calc/10.))/8.,(cut*pot/(calc/10.))/15.,1);
	    break;
	    }
	}
	
	
	
	
}