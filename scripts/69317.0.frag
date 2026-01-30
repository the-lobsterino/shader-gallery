
#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;


float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
 
#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float LR(vec2 p, float d){p.x=abs(p.x);return line2(d,p,vec4(2,-3.25,2,3.25)*CHS);}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float TBLR(vec2 p, float d){return min(d,abs(sdBox2(p,vec2(2,3.25)*CHS)));}
float A(vec2 p,float d){d=LR(p,d);p.y=abs(p.y-1.5*CHS);return line2(d,p,vec4(2,1.75,-2,1.75)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));}
float C(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float D(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,-1,2,1)*CHS);p.y=abs(p.y);d=line2(d,p,vec4(2,1,1.5,2.75)*CHS);d=line2(d,p,vec4(1.5,2.75,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-2,3.25)*CHS);} // 
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float F(vec2 p,float d){d=line2(d,p,vec4(2,3.25,-2,3.25)*CHS);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float G(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,2.25,2,3.25)*CHS);d=line2(d,p,vec4(2,-3.25,2,-0.25)*CHS);return line2(d,p,vec4(2,-0.25,0.5,-0.25)*CHS);}
float H(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(-2,-0.25,2,-0.25)*CHS);}
float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);}
float J(vec2 p,float d){d=line2(d,p,vec4(-1.5,-3.25,0,-3.25)*CHS);d=line2(d,p,vec4(0,-3.25,1,-2.25)*CHS);d=line2(d,p,vec4(1,-2.25,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-1.5,3.25)*CHS);}
float K(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(-2,-0.25,-0.5,-0.25)*CHS);d=line2(d,p,vec4(2,3.25,-0.5,-0.25)*CHS);return line2(d,p,vec4(-0.5,-0.25,2,-3.25)*CHS);}
float L(vec2 p,float d){d=line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float M(vec2 p,float d){p.x=abs(p.x);d=line2(d,p,vec4(2,-3.25,2,3.25)*CHS);return line2(d,p,vec4(0,0.75,2,3.25)*CHS);}
float N(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);}
float O(vec2 p,float d){return TBLR(p,d);}
float P(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d,abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float Q(vec2 p,float d){d=TBLR(p,d);return line2(d,p,vec4(2,-3.25,0.5,-1.75)*CHS);}
float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float S(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-0.25)*CHS);d=line2(d,p,vec4(-2,-0.25,2,-0.25)*CHS);return line2(d,p,vec4(2,-0.25,2,-3.25)*CHS);}
float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float U(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);}
float V(vec2 p,float d){p.x=abs(p.x);return line2(d,p,vec4(0,-3.25,2,3.25)*CHS);}
float W(vec2 p,float d){p.x=abs(p.x);d=line2(d,p,vec4(2,-3.25,2,3.25)*CHS);return line2(d,p,vec4(0,-1.25,2,-3.25)*CHS);}
float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
float Y(vec2 p,float d){d=line2(d,p,vec4(0,-0.25,0,-3.25)*CHS);p.x=abs(p.x);return line2(d,p,vec4(0,-0.25,2,3.25)*CHS);}
float Z(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
float i_(vec2 p,float d){d=line2(d,p,vec4(0.,-0.0,0.,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(.0,3.25,-0.0,3.25)*CHS);}
float LL(vec2 p,float d){d=line2(d,p,vec4(0.0,0.,1.5,0.0)*CHS);
			 
return d ;} 
 
float GetText(vec2 uv)
{       
	uv *=2.;
	uv.x += 7.30;
	
	float	d = P(uv,1.0);uv.x -= 1.1;
		d = O(uv,d);uv.x -= 1.1;
		d = L(uv,d);uv.x -= 1.1;
		d = I(uv,d);uv.x -= 1.1;
		d = T(uv,d);uv.x -= 1.1;
		d = I(uv,d);uv.x -= 1.1;
	        d = C(uv,d);uv.x -= 1.1;
	        d = A(uv,d);uv.x -= 1.1;
      	        d = L(uv,d);uv.x -= 1.91;
	        d = I(uv,d);uv.x -= 1.1;
	        d = S(uv,d);uv.x -= 1.1;
	        d = L(uv,d);uv.x -= 1.1;
	        d = A(uv,d);uv.x -= 1.1;
	        d = M(uv,d);uv.x -= 1.1;
	
	return smoothstep(0.0,0.2,d-0.12*CHS);
}
 
void main( void )
{
	vec2 p0 = gl_FragCoord.xy+5.*vec2(cos(time/50.),tan(time/3.));
	vec2 p  = (p0 * 2.0 - resolution) / min(resolution.x, resolution.y);//;
	
	float d= GetText(p*1.958);
	float t=time, pixsize=1.5,step=pixsize; //time*pixsize;//fract(time)*pixsize;	
	vec2 xyh = vec2(floor(p0/pixsize)*pixsize);	
	float    gh  =   -mod( xyh.y      +t, -abs(cos(xyh.x)) +.0010 ) + clamp((  xyh.y       /resolution.y ) * 2.-1.,-.3,.0)
		,gh0 =   -mod( xyh.y-step +t, -abs(cos(xyh.x)) +.0050 ) + clamp(( (xyh.y-step) /resolution.y ) * 2.-1.,-.3,.0)
		,gh1 =   -mod( xyh.y+step +t, -abs(cos(xyh.x)) +.001 ) + clamp(( (xyh.y+step) /resolution.y ) * 2.-1.,-.3,.0);
	
	
	float wh = float(gh>gh1 && gh>gh0 && gh0<gh1); 
	gl_FragColor = vec4(wh,wh,wh,1)*(1.-d)*4.*gh;
	
        gl_FragColor += texture2D(backbuffer,gl_FragCoord.xy/resolution)*.55 ;
	//gl_FragColor *= distance(normalize(gl_FragColor), vec4(0.,2.0,.0,1)*d) *vec4(.4,.4,1,1);
	gl_FragColor *= distance(normalize(gl_FragColor), vec4(0.,2.+cos(time*5.),.0,1)*d) *vec4(1.4,.0,0.5,0);
	gl_FragColor.a=1.;
	gl_FragColor+=.2-pow(d,3.);
}

