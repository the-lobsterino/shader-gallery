// LIM(E)R
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;



 
#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float LR(vec2 p, float d){p.x=abs(p.x);return line2(d,p,vec4(2,-3.25,2,3.25)*CHS);}
float TBLR(vec2 p, float d){return min(d,abs(sdBox2(p,vec2(2,3.25)*CHS)));}
float A(vec2 p,float d){d=LR(p,d);p.y=abs(p.y-1.5*CHS);return line2(d,p,vec4(2,1.75,-2,1.75)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));}
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float L(vec2 p,float d){d=line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float O(vec2 p,float d){return TBLR(p,d);}
float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} // KISS MY CUNT
float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float U(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);}
float V(vec2 p,float d){p.x=abs(p.x);return line2(d,p,vec4(0,-3.25,2,3.25)*CHS);}

float GetText(vec2 uv)
{
	float t = time;
	uv*=6.+sin(t)*0.25;
	uv.x += 1.7;
	uv.y -= .9;
	float d = V(uv,1.0);uv.x -= 1.1;
	d = O(uv,d);uv.x -= 1.1;
	d = T(uv,d);uv.x -= 1.1;
	d = E(uv,d);
	uv.x += 4.3;
	uv.y += 1.8;
	d = L(uv,d);uv.x -= 1.1;
	d = A(uv,d);uv.x -= 1.1;
	d = B(uv,d);uv.x -= 1.1;
	d = O(uv,d);uv.x -= 1.1;
	d = U(uv,d);uv.x -= 1.1;
	d = R(uv,d);
	return smoothstep(0.,0.025,d-0.55*CHS);
}
#define PI 3.14159

vec3 ddd(vec2 p)
{
	float xd = GetText(p);
	float xd2 = GetText(p-vec2(-0.025,0.025));
	vec3 cc = vec3(1.2,0.3,0.3);
	vec3 cc2 = mix(cc*0.15,cc,xd);
	cc = mix(cc*2.25+(sin(p.x*3.0+p.y*10.0+time*3.3)*0.25),cc2,xd2);
	float rf = sqrt(dot(p, p)) * .75;
	float rf2_1 = rf * rf + 1.0;
	float e = 1.0 / (rf2_1 * rf2_1);
	return cc.rgb*e;
}


void main(void)
{
    vec2 uv = (gl_FragCoord.xy - resolution * .5) / resolution.yy;
    float t1 = mod(time*0.3,1.5);
    if (t1>1.25)
        t1=0.0;
    t1 = clamp(t1,0.0,1.0);
    float nt = fract(t1);
    float eRad = 2.0 * nt;
    float eAng = (2. * PI) * (nt*2.95);
    float len = length(uv);
    float ang = atan(uv.y, uv.x) + eAng * smoothstep(eRad, 0., len);
    float rad = length(uv);
    vec3 cc = ddd(uv);
    vec3 col1 =  ddd(vec2(rad * cos(ang), rad * sin(ang)) );
    float nt2 = (len*2.0) - (nt*2.0);
    nt2 = mix(1.0,nt2-nt,nt);
    nt2 = clamp(nt2,0.0,1.0);
    vec3 col2 = vec3(0.0);	//ddd(uv);
    col1 = mix(col2,col1,nt2);	
    gl_FragColor  = vec4( col1,1.0);
}