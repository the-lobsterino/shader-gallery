//--- Loading Circle (Capsule)
// by Catzpaw 2020

#ifdef GL_ES
precision mediump float;
#endif

#define SPEED 8.
#define HUESPEED .0012
#define SATURATION .85
#define DIVISIONS 24.
#define INNER .5
#define OUTER .8
#define SIZE .08
#define BOKEH 1. 

uniform float time;
uniform vec2 resolution;

//sdSegment by iq
//https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float sdSegment(vec2 p,vec2 a,vec2 b){
	vec2 pa=p-a,ba=b-a;
	float h=clamp(dot(pa,ba)/dot(ba,ba),0.,01.);
	return length(pa-ba*h);
}

mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,s,-s,c);}
vec3 hsv(float h,float s,float v){return ((clamp(abs(fract(h+vec3(0.,.666,.333))*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;}

void main( void ) {
	vec2 p=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);

	//slice a pie
	const float idiv=1./DIVISIONS;
	float a=floor(atan(p.x,p.y)*DIVISIONS/6.283+.5);

	//segment sdf
	vec2 vSeg=vec2(0,1)*rot(a*6.283*idiv);
	float d=sdSegment(p,vSeg*INNER,vSeg*OUTER);

	//make a capsule from segment sdf
	float v=smoothstep(SIZE,SIZE-BOKEH*( 2./resolution.y ),d);

	//color
	float t=floor(DIVISIONS-fract(time*SPEED)*DIVISIONS);
	v*=fract((t+a)*idiv);
	float h=fract(time*HUESPEED+a*idiv);
	gl_FragColor = vec4(hsv(h,SATURATION,v),1);

}
