/*** Sierpinski carpet ***/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float it = 5.0; // Number of iterations

vec2 rotate(vec2 pos, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, s, -s, c) * pos;
}


void main( void ) {

	float mx = max(resolution.x, resolution.y);
	vec2 scrs = resolution/mx;
	vec2 uv = gl_FragCoord.xy/mx*2.-1.0;
	 
	   
    	// let's rotate ... 2D! gtr
        uv = rotate( uv,sin(time/5.)*6.);
	
	float v = pow(3.0,it)+10.0;
	
	gl_FragColor = vec4(0.0); // Background color
	
	for (float i = 0.0; i < it; i++)
	{
		if(floor(mod(uv.x*v,3.0))==1.0 && floor(mod(uv.y*v,3.0))==1.0){
			 
			gl_FragColor = vec4(((sin(i*uv.y-time*0.5+3.0*PI/3.0)+1.0))/2.0, // RED
					    ((sin(i*uv.y-time*0.5+4.0*PI/3.0)+1.0))/2.0, // GREEN
					    ((sin(i*uv.y-time*0.5+6.0*PI/3.0)+1.0))/2.0, // BLUE
					    1.0);					
		                             
		}
		v/=3.0;	
		uv.x =uv.x+time/50.;// let's scrolling gtr 
		
		//(mouse.x>0.5) ? uv.x =uv.x+time/30. : uv.x =uv.x-time/30.;
		//(mouse.y<0.5) ? uv.y =uv.y+time/30. : uv.y =uv.y-time/30.;
	}
}