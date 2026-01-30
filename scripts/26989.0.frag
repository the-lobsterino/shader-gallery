// Kali Set Julia Explorer
// http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/

precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;




/* 	Coloring Functions 
	Only one can be defined at a time.
	If none are defined, basic escape-time is used.
	I still haven't learned how to do the cooler ones :(
*/

	//#define shiny_balls
	//#define atanPlates





/* Uncomment this for mouse interactivity */

	//#define interactive







#define ZOOM_LEVEL 20.0
#define Julia

void main( void )
{
	float col = 0.0;
	float zoom = ZOOM_LEVEL+150.0;	
	float ratio = resolution.x/resolution.y;
	
	vec2 cCoord = gl_FragCoord.xy-resolution/2.0-vec2(0.,-1200.5);
	cCoord*=300.0/resolution;
	cCoord/=zoom;
	cCoord.x*=ratio;
	
	vec2 mouseCoord = mouse;
	mouseCoord-=vec2(0.5);
	mouseCoord*=5.0*distance(mouse,vec2(0.5));
	mouseCoord+=vec2(-0.5,-0.5);
	mouseCoord.x*=ratio;
	
	#ifdef interactive
		#ifdef Julia
			vec2 z = cCoord;
			vec2 c = mouseCoord;
		#else
			vec2 c = cCoord-mouseCoord*2.0;
			vec2 z = vec2(1.0);
		#endif
	#else
		vec2 c = vec2(-1.09,-0.054);
		#ifdef atanPlates
		c= vec2(-1.429611,-0.04512);
		#endif
		#ifdef shiny_balls
		c=vec2(-0.12809,-0.06425);
		#endif
		vec2 z = cCoord;
	#endif
	
	vec2 xy;
	float m;
	for(int i=0;i<=128;i++){
		//z=vec2(z.x*z.x-z.y*z.y,abs(2.0*z.x*z.y));
		
		xy   = vec2(abs(z.x),abs(z.y));
		m    = xy.x*xy.x + xy.y*xy.y;
		xy.x = xy.x/(m) + c.x;
		xy.y = xy.y/(m) + c.y;
		z=xy;
		
		if(length(z)>4.0){
			
			col=smoothstep(0.0,1.0,1.3*float(i)/128.0);
			
			#ifdef atanPlates
			col=length(atan(c,z));
			col/=2.0;
			#endif
			
			#ifdef shiny_balls
			col=length(z);
			col/=6.0;
			#endif
			
			
			break;
		}
	}
		
	//vec4 mycol = col.xxxx;//vec4(gl_FragCoord.xy/resolution*col,(sin(time*0.5)*0.5+0.5)*col,1.0);
	if(col > .6){
		gl_FragColor = vec4(0.);
	}
	else {
		gl_FragColor = vec4(1.);
	}
	//gl_FragColor=vec4(col,c,1.0);
}