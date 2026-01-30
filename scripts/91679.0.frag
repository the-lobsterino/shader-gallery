#ifdef GL_ES
precision mediump float;
#endif
//2022.09.23 modified by Jiaotangsheng
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI  3.14159265359
#define PI_2 6.283185307179586

void main( void ) {
        float scale = 0.2; // scale
	int sides = 5; // nb branches (max: 20)
	
	vec2 p = 2.0*(gl_FragCoord.xy-0.5*resolution)/min(resolution.x,resolution.y);
	//vec2 p = (2.*position - 1.);
	//p.x *= resolution.x/resolution.y;

	
	float angle = PI_2/float(sides);
	
	mat2 m = mat2(
	  cos(angle),
	  sin(angle),
	 -sin(angle),
	  cos(angle)
        );
		
	int c = 0;
	for (int i=0;i<20;i++) {
	  if (i>= sides) break;
	  if (p.y < scale) c++;
	  p *= m;
	}

	gl_FragColor = (c > sides - (sides-1)/2 )
		? vec4(p.x+p.y,1,1.0, 1.0)
		: vec4(0,0,0,0);
	
}