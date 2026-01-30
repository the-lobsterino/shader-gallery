#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define a 0.1
//sqrt(3)/2.0
#define sqr 0.8660254037844386

float h=a*sqr ;
// taken from http://glslsandbox.com/e#45693.1 but code is borrowed from inigo quilez - iq i think
vec2 hash( vec2 p ) { p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return fract(sin(p)*18.5453); }



void main( void ) {
	vec2 uv=(gl_FragCoord.xy/resolution.xy)*2.0-1.0 ;
	uv.x*=resolution.x/resolution.y ;
	
	// x,y is lower left corner/vertice of rectangle cell
	float x=floor(uv.x/(a*1.5))  ;// 
	float y=floor(uv.y/h)  ;//
	
	bool b=y/2.0>floor(y/2.0) ;// b true -> odd row in same column
	
	bool b2=x/2.0>floor(x/2.0) ;  //b2 true -> odd column
	
	if(!b2){
		b=!b ;
	}
	
	vec3 color=vec3(0.07) ;
	
	if(b){
		float y1=(y+1.0)*h   ;//
		float x1=x*a*1.5 ;
		float y2=y*h ;
		float x2=(x+1.0)*a*1.5 ;
		
		bool bx=distance(uv,vec2(x1,y1))>distance(uv,vec2(x2,y2)) ;
		
		if(bx){
			color=vec3(hash(vec2(x2,y2)),0.321) ;
		}else{
			color=vec3(hash(vec2(x1,y1)),0.321) ;
		}
	}else{
		float y1=y*h ;
		float x1=x*a*1.5 ;
		float y2=(y+1.0)*h ;
		float x2=(x+1.0)*a*1.5 ;
		
		bool bx=distance(uv,vec2(x1,y1))>distance(uv,vec2(x2,y2)) ;
		
		
		if(bx){
			color=vec3(hash(vec2(x2,y2)),0.321) ;
		}else{
			color=vec3(hash(vec2(x1,y1)),0.321) ;
		}

	}
	gl_FragColor=vec4(color,1.0) ;
	//gl_FragColor=vec4(0.07) ;
}

/*

Riemann 03-08-2018
b51b395f27f4c1933170c91168df29c02306a497e28c421984ac5a21c500675c
*/

/*
Hexagon Algorithm (based on Voronoi partition) :

2D space we divide into a net(net of rectangles(rectangle-cells)) where nodes/vertices are cenres of hexagon-cells
each rectangle-cell is a*1.5 wide and has height h=a*sqrt(3)/2
notice diff between hexagon and rectangle cells - hexagon we draw and rectangle are just helper stuff or concept :)
Zero-hexagon-cell is positioned at 0.0 and has 2 edges parallel with x axis
each rectangle cell has 2 parts which belong to 2 diff hexagon cells
to which hexagon-cell fragment(pixel) at uv belongs we decide based on to which rectangle-vertice is closer
those vertices are diagonal ones (on oppoisite ends of a digaonal)
tricky thing is to decide which diagonal to use :
*** DIAGONALS
if we look at 1st column of rectangle cells (to this column belongs rectangle<(0,0),(1.5*a,0),(1.5*a,h)(0,h)>)
then we use diagonal [(0,0),(1.5*a,h)] but for cell above this one we use 2nd diagonal so : 
odd cells have 1 diagonal and even cells have 2 diagonal
also if we look at 1st left column we see that we have opposite case also on 2nd left situation is the same 
NOW : with variable b from program we decide which digaonal to use inside cells wich belongs to same column >> is it odd or even cell in the same column 
AND with variable b2 we decide which column we use so that we can tell are we in odd or even column
notice :: changes between odd and even cells inside same column and changes between odd and even column
*** END DIAGONALS
color of cell is decided by the noise value(look at hash function) of center of hexagon-cell in which all points have same color
notice again : center of hexagon-cells are at the same time vertices of rectangle-cells
also dimension of hexagon cell edge is a 

I'm bad in explanations but if u DRAW on a paper hexagon-cells and helper rectangle-cells everything
will be clear in few mins ... 

*/