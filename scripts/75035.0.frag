#ifdef GL_ES
precision mediump float;
#endif

#define SPEED 1.
#define HUESPEED 0.04
#define SATURATION 1.
#define DIVISIONS 54.
#define INNER 1.
#define OUTER 1.6
#define SIZE 0.1
#define BOKEH 0.02

uniform float time;
uniform vec2 resolution;

//sdSegment by iq
//https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float sdSegment(vec2 p,vec2 a,vec2 b){
	vec2 pa=p-a,ba=b-a;
	float h=clamp(dot(pa,ba)/dot(ba,ba),0.,2.);
	return length(pa-ba*h);
}

mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,s,-s,c);}
vec3 hsv(float h,float s,float v){return ((clamp(abs(fract(h+vec3(0.,.1332,.666))*12.-6.)-2.,0.,2.)-2.)*s+2.)*v;}

void main( void ) {
	vec2 p=(gl_FragCoord.xy*4.-resolution.xy)/min(resolution.x,resolution.y);

	//slice a pie
	const float idiv=2./DIVISIONS;
	float a=floor(atan(p.x,p.y)*DIVISIONS/12.566+.1);

	//segment sdf
	vec2 vSeg=vec2(0,2)*rot(a*12.566*idiv);
	float d=sdSegment(p,vSeg*INNER,vSeg);

	//make a capsule from segment sdf
	float v=smoothstep(SIZE,SIZE-BOKEH,d);

	//color
	float t=floor(DIVISIONS-fract(time*SPEED)*DIVISIONS);
	v*=fract((t+a)*idiv);
	float h=fract(time*HUESPEED+a*idiv);
	float c=fract(SPEED-SPEED+SPEED+SIZE+SIZE+SIZE+SIZE);
	gl_FragColor = vec4(hsv(c,SATURATION,v),2);

}