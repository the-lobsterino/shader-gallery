/*** Sierpinski carpet ***/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

const float it = 5.0; // Number of iterations

vec2 rotate(vec2 pos, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, s, -s, c) * pos;
}

float tw()
{
	return sin(time) * 0.5 + 0.5;
}

void main( void ) {

	float mx = max(resolution.x, resolution.y);
	vec2 scrs = resolution/mx;
	vec2 uv = gl_FragCoord.xy/mx*2.-1.0;
	vec3 color = vec3(0.0);	 
	   
    	// let's rotate ... 2D! gtr
        uv = rotate( uv,time/9.);
	
	float v = pow(3.0,it*0.8)+10.0;
	
	gl_FragColor = vec4(color, 1.0); // Background color

	
	
	for (float i = 0.0; i < it; i++)
	{
		if(floor(mod(uv.x*v,4.0))==1.0 && floor(mod(uv.y*v,4.0)) == 1.0)
		{
			 
			
			color += vec3(((sin(i*uv.y-time*0.125+3.0*PI/3.0)+1.0))/2.0, // RED
					    ((sin(i*uv.y-time*0.125+4.0*PI/3.0)+1.0))/2.0, // GREEN
					    ((sin(i*uv.y-time*0.25+6.0*PI/3.0)+2.0))/3.0) // BLUE
				
				* (i/it+0.5);
				
			
			if (i == 0.0)
			{
				color *= 0.33;
			}
			
			if (i == it - 2.0 || i == it - 1.0)
			{
				vec2 uv2 = mod(uv*v, 4.0) - 1.0;
				//uv2 = floor(uv2 * 100.)/100.;
				
				uv2.x *= resolution.y/resolution.x;			
				
				/* vec3 p = vec3(uv2, sin(time*0.01));
	
			
				for (int i = 0; i < 24; i++)
				{
					p.zyx = abs(( abs(p)/dot(p,p) - vec3(1.0,1.0, sin(time*0.1)* 0.3)));
				}	
				
				color = p.zxy; */
				color = texture2D(bb, uv2).xyz;
				if (color == vec3(0.0)) { color = vec3(0.05); }
			}
		}
		
		v/=2.8 + mouse.x/100.;
	  	uv.x =uv.x+time/10.;// let's scrolling gtr 		
		//(mouse.x>0.5) ? uv.x =uv.x+time/30. : uv.x =uv.x-time/30.;
		//(mouse.y<0.5) ? uv.y =uv.y+time/30. : uv.y =uv.y-time/30.;
	}
	
	gl_FragColor = vec4(color, 1.0);
}