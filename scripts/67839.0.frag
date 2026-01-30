
// LIM(E)
#ifdef GL_ES
precision highp float;
#endif

uniform vec2      resolution;
uniform float     time;
const float Pi = 3.14159;

 //fork
#define CHS 0.18
float circR(in vec2 p,in float b) { p.x+=.86*CHS; if(p.x<-1.*CHS) return 1.; p.x=max(abs(p.x),1.3*CHS); return length(p)-b; } 
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y=abs(p.y)*1.3-2.1*CHS; d=line2(d,p,vec4(-2,-2,-2,2.4)*CHS); return min(d,abs(circR(p,2.6*CHS)));}
float R(vec2 p,float d){p.y=p.y*1.3-2.1*CHS; d=line2(d,p,vec4(-2,-6.5,-2,2.4)*CHS); d=line2(d,p,vec4(.3,-2.4,2,-6.5)*CHS);return min(d,abs(circR(p,2.6*CHS)));}
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float X(vec2 p,float d){p=abs(p);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS*4.);}
float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);}
float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}

float GetText(vec2 uv)
{
	uv *= sin(time);
	float ypos = 1.;
	ypos = pow(ypos,2.);
	uv*=4.;
	uv.x += 2.65;
	uv.y -= 0.;
	float d = B(uv,1.);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = X(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = T(uv,d);
	return smoothstep(0.,.23 + pow(ypos/3.,2.),d-0.1*CHS);
}

void main() {
    vec2 p = (gl_FragCoord.xy - resolution * .5) / resolution.yy;
    float cc = GetText(p);
	// xxx it. kl;ok
	

    for(float i=1.;i<11.;i++)
    {
    	vec2 newp=p;
	float ii = i/5.+cc;  
    	newp.x+=0.55/ii*sin(ii*Pi*p.y+time/30.+cos((time/(9.*ii))*ii));
    	newp.y+=0.55/ii*cos(ii*Pi*p.x+time/30.+sin((time/(10.*ii))*ii));
    	p=newp;
    }
	float red = .6+ mod(2.*abs(cos(p.x+p.y+3.)),1.5), 
		green = red-mod(abs(sin(p.x+p.y+6.)),.35),
		blue = red/2.+green/2. - 2.*abs(sin(p.x/5.)+cos(p.y));
    if(cc<.5)
    gl_FragColor=vec4(red, green, red*green*blue/9., 1.0);
	
	if(cc<.15) gl_FragColor*=cc*20.;
	else if(cc<.5) gl_FragColor*=cc;
}
