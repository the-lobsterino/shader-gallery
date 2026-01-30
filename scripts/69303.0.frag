
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define iResolution resolution
#define iTime time
#define iMouse mouse

void mainImage(out vec4 fragColor, in vec2 fragCoord);

void main(void) {
    vec4 col;
    mainImage(col, gl_FragCoord.xy);
    gl_FragColor = col;
}                                  
                     

// Emulate a black texture
#define texture(s, uv) vec4(0.0)         


#define ROT(t) mat2(cos(t), sin(t), -sin(t), cos(t))
#define CHS 0.095
//float CHS = 0.05;


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
         uv.x += 1.;
    float g = 0.6;      
    float d =D(uv,4.0); uv.x -=g;
          d =E(uv,d); uv.x -=g*1.;
	  d =M(uv,d); uv.x -=g*1.;
	  d =O(uv,d); uv.x -=g*1.;
	  d =C(uv,d); uv.x -=g*1.;
	  d =R(uv,d); uv.x -=g*1.;
	  d =A(uv,d); uv.x -=g*1.;
	  d =C(uv,d); uv.x -=g*1.;
	  d =Y(uv,d); uv.x -=g*1.;

         return d;
}

float smin(float a, float b, float k)
{
    float h = clamp(1.-abs((b-a)/k), 0., 2.);
    return min(a,b) - k*0.25*h*h*step(-1.,-h);
}
vec3 erot(vec3 p, vec3 ax, float ro)
{
    return mix(dot(p,ax)*ax,p,cos(ro))+sin(ro)*cross(ax,p);
}

float WaveletNoise(vec3 p, float z, float k) {
    
    float d=0.,s=1.,m=0., a;
    for(float i=0.; i<5.; i++) {
        
	vec3 q = p*s, g=fract(floor(q)*vec3(2.34,2.53,3.15));    
    	g += dot(g, g+23.234);
	q = (fract(q)-.5);
        q = erot(q, normalize(tan(g*.1)), a);
        d += sin(q.x*5.+z)*smoothstep(.25, .0, dot(q,q))/s; 
        p = erot(p,normalize(vec3(-1,1,0)),atan(sqrt(2.)))+i; 
        m += 1./s;
        //s *= k; 
	 
    }
    return d/m;
}
  
float map( vec3 p )
{
	float v = WaveletNoise(p*.8,iTime*02., 1.15)*.2;
	float v2 = WaveletNoise(p+vec3(0.0,20.0,0.0),iTime*3., 1.15)*0.2;
	vec3 pp=p+vec3(v,v2,v);
	float d = (sin(p.x-0.5+iTime*0.)*5.3+6.5)-length(pp);
	d = smin(p.z+0.425+v2*0.5+(sin(p.y*1.0+iTime*2.2+p.z*.75)*0.1),d,4.0);
	float t = 8.5*iTime; 
	p.yx*=ROT(3.14+sin(fract(t*0.0131)*6.28+p.y*-.013)*3.141); 
	p.z+=sin(sin(fract(p.z*0.4+iTime*01.35)*3.14))*0.215; 
	float d2 = GetText(p.yz+vec2(0.7,-0.32))-0.02;
	vec2 e = vec2( d2, abs(p.x) - 0.051 );	
	d2 = min(max(e.x,e.y),-0.0) + length(max(e,0.0)) -0.0542; 
	d2 = smin(d,d2,0.25);    
	return d2*0.29; 
}

vec3 normal( vec3 p )
{
    vec2 e = 0.025 * vec2(1, -1);
    return normalize(
          e.xxx * map(p+e.xxx)
        + e.xyy * map(p+e.xyy)
        + e.yxy * map(p+e.yxy)
        + e.yyx * map(p+e.yyx)
	+ e.yyy * map(p+e.yyy) 
    );
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.0*fragCoord - iResolution.xy)/iResolution.y;
    uv.x += 0.30;
    uv.y += 0.15;	
    float th = 0.0;
    float di = 3.05   ; 
    vec3 ro = vec3(di*cos(th), di*sin(th), 0.0);
    vec3 camFwd = normalize(vec3(0.5,0,0) - ro);
    vec3 camRight = normalize(cross(camFwd, vec3(0,0,1)));
    vec3 camUp = cross(camRight, camFwd);
    float fov = .85;  
    vec3 rd = (camFwd + fov * (uv.x * camRight + uv.y * camUp));
    rd = normalize(rd);
	
    
    float d, t=0.;
    for(int i=0; i<100; i++)	
    {
        d = map(ro+t*rd);
        if(d < 0.001 || t > 100.) break;
        t += d;
    }
    vec3 p = ro+t*rd;
    vec3 col = vec3(0.0);		
    if(t < 100.)
    {
	vec3 pos = ro + t*rd;
	vec3 nor = normal(p);
	vec3 dir = normalize(vec3(1.0,0.7,0.0));		
	vec3 ref = reflect(rd, nor);
	float spe = max(dot(ref, dir), 0.0);
	vec3 spec = vec3(.480) * pow(spe, 6.);
	float dif = clamp( dot(nor,dir), 0.15, 1.0 );
	    
	    float vv = fract(pos.z*0.8+pos.x*0.8+iTime*0.5+pos.y*0.2);
	    vv = 1.0+sin(vv*6.28)*0.25;
	
	col =  vec3(vv*0.92*(1.),vv*0.8*(1.),vv*1.9 ) *dif;    
        col+=spec;
	float sca = clamp(length(p), 1.0, 10.0);
	
    }
    col *= smoothstep(2.5,1.0,length(uv));
   
    fragColor = vec4(col, 1.0);
}


