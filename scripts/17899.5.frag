#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//is this ok?
//>>*Can someone show me how to draw a star with 5 edges ?  plz T_T*/

#define PI 3.1416

const int maxpoints = 19;

bool inStar( in vec2 p, int points ){
	float angle = PI*2./float(points);
	mat2 r = mat2(cos(angle),sin(angle),-sin(angle),cos(angle));
		
	int c = 0;
	for (int i=0;i<maxpoints;i++)
	{
		if (i>= points)
			break;
		
		if (p.y < mouse.x*0.5) 
			c++;
		p*=r;
	}
	
	return (c > points - (points-1)/2 );
}
void main( void ) {

	vec2 position = gl_FragCoord.xy/resolution.xy;
	vec2 q = (2.*position - 1.);
	q.x *= resolution.x/resolution.y;
	q.x-=1.;
	q.y-=0.5;
	
	vec3 col = vec3(0.0);
	
	col += inStar(q,5)?vec3(q.x,q.y,1.0):vec3(0.0); q.x+=1.;
	col += inStar(q,6)?vec3(q.x,1.0,q.y):vec3(0.0); q.x+=1.;
	col += inStar(q,7)?vec3(1.0,q.x,q.y):vec3(0.0); q.y+=1.;
	col += inStar(q,8)?vec3(1.0,1.0,q.x+q.y):vec3(0.0); q.x-=1.;
	col += inStar(q,9)?vec3(1.0,q.x+q.y,1.0):vec3(0.0); q.x-=1.;
	
	int p = int((1.0-mouse.y)*18.);
	col += inStar(q,p)?vec3(q.x+q.y,1.0,1.0):vec3(0.0);
	
	gl_FragColor = vec4(col,1.);


}