// LIM(E)R
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

 
#define CHS 0.18
 
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float LR(vec2 p, float d){p.x=abs(p.x);return line2(d,p,vec4(2,-3.25,2,3.25)*CHS);}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float TBLR(vec2 p, float d){return min(d,abs(sdBox2(p,vec2(2,3.25)*CHS)));}
float A(vec2 p,float d){d=LR(p,d);p.y=abs(p.y-1.5*CHS);return line2(d,p,vec4(2,1.75,-2,1.75)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));}
float C(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float D(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,-1,2,1)*CHS);p.y=abs(p.y);d=line2(d,p,vec4(2,1,1.5,2.75)*CHS);d=line2(d,p,vec4(1.5,2.75,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-2,3.25)*CHS);} // SUCK MY ARSEHOLE
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
 
float GetText(vec2 uv)
{
	float t = time;
	uv*=6.+sin(t)*0.25;
	uv.x += 2.2;
	uv.y -= .9;
	float d = S(uv,1.0);uv.x -= 1.1;
	d = M(uv,d);uv.x -= 1.1;
	d = O(uv,d);uv.x -= 1.1;
	d = K(uv,d);uv.x -= 1.1;
	d = E(uv,d);
	uv.x += 3.9;
	uv.y += 1.8;
	d = W(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = D(uv,d);
	 
	return smoothstep(0.,0.025,d-0.55*CHS);
}
#define PI 3.14159
mat2 rot(float a) {
	return mat2(cos(a),sin(a),-sin(a),cos(a));	
}

vec3 ddd(vec2 p)
{       
	 p *=rot(p.x+0.5+sin(time*2.)-0.5);// better smoke ;)
 	
	float xd = GetText(p);
	float xd2 = GetText(p-vec2(-0.025,0.025));
	vec3 cc = vec3(0.5,0.67,0.8);
	vec3 cc2 = mix(cc*0.15,cc,xd);
	cc = mix(cc*2.25+(sin(p.x*3.0+p.y*10.0+time*3.3)*2.25),cc2,xd2);
	float rf = sqrt(dot(p, p)) * .75;
	float rf2_1 = rf * rf + 1.0;
	float e = 1.0 / (rf2_1 * rf2_1);
	return cc.rgb*e;
}

float dfSemiArc(float rma, float rmi, vec2 uv)
{
	return max(abs(length(uv) - rma) - rmi, uv.x-0.0);
}

float dfSemiArc2(float rma, float rmi, vec2 uv)
{
	return min(abs(length(uv) - rma) - rmi, uv.x+4.0);
}



float dfQuad(vec2 p0, vec2 p1, vec2 p2, vec2 p3, vec2 uv)
{
	vec2 s0n = normalize((p1 - p0).yx * vec2(-1,1));
	vec2 s1n = normalize((p2 - p1).yx * vec2(-1,1));
	vec2 s2n = normalize((p3 - p2).yx * vec2(-1,1));
	vec2 s3n = normalize((p0 - p3).yx * vec2(-1,1));
	
	return max(max(dot(uv-p0,s0n),dot(uv-p1,s1n)), max(dot(uv-p2,s2n),dot(uv-p3,s3n)));
}

float dfRect(vec2 size, vec2 uv)
{
	return max(max(-uv.x,uv.x - size.x),max(-uv.y,uv.y - size.t));
}

//--- Letters ---
void _G(inout float df, vec2 uv)
{
	
	df = min(df, dfSemiArc(0.5, 0.125, uv));
	df = min(df, dfQuad(vec2(0.000, 0.375), vec2(0.000, 0.625), vec2(0.250, 0.625), vec2(0.25, 0.375), uv));
	df = min(df, dfRect(vec2(0.250, 0.50), uv - vec2(0.0,-0.625)));
	df = min(df, dfQuad(vec2(-0.250,-0.125), vec2(-0.125,0.125), vec2(0.250,0.125), vec2(0.250,-0.125), uv));	
}

void _I(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.280,-0.625)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-0.45,0.40)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-0.45,-0.625)));
}

//

void _A(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.550,-0.625)));
    df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.1,-0.625)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-0.50,0.38)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-0.50,-0.20)));
   
}


void _T(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.550,-0.625)));
    df = min(df, dfRect(vec2(0.700, 0.25), uv - vec2(-0.8,0.38)));
    
 
   
}

void _R(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-1.0,-0.625)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-0.95,0.38)));
   df = min(df, dfRect(vec2(0.200, 0.60), uv - vec2(-0.600,-0.10)));
    df = min(df, dfRect(vec2(0.450, 0.25), uv - vec2(-0.95,-0.10)));
    
  //  df = min(df, dfRect(vec2(0.450, 0.25), uv - vec2(-0.80,-0.10)));

   df = min(df, dfQuad(vec2(-0.900,-0.100), vec2(-0.600,-0.100), vec2(-0.350,-0.625), vec2(-0.550,-0.625), uv));
   
   
}

void _O(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-1.20,-0.625)));
    df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.750,-0.625)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-1.10,0.38)));
    df = min(df, dfRect(vec2(0.550, 0.25), uv - vec2(-1.10,-0.625)));
   
}

void _N(inout float df, vec2 uv)
{
	df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-1.30,-0.625)));
    df = min(df, dfRect(vec2(0.200, 1.25), uv - vec2(-0.650,-0.625)));
   df = min(df, dfQuad(vec2( -1.300,.625), vec2(-1.000,0.625), vec2(-0.450,-0.625), vec2(-0.650,-0.625), uv));
}



vec3 giga(vec2 uv)
{
	float tt=time;
     float bf=1.4;
	float dis = 1e6;
	float charSpace = 1.025;
	vec2 chuv = uv*18.0-vec2(4.8,0.5);
	chuv.x += charSpace * 3.0;
	

    _G(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.)))); chuv.x -= charSpace*0.9;
    
    _I(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*2.0)))); chuv.x -= charSpace*0.9;
    _G(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*3.0)))); chuv.x -= charSpace;
    _A(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*4.0)))); chuv.x -= charSpace*1.1;
    _T(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*5.0)))); chuv.x -= charSpace*1.1;
    _R(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*6.0)))); chuv.x -= charSpace;
    _O(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*7.0)))); chuv.x -= charSpace*0.95;
    _N(dis, chuv-vec2(0.0,abs(sin(tt*2.+bf/6.*8.0)))); chuv.x -= charSpace;

   float mask = smoothstep(8.0/resolution.y,0.1,dis);
	mask = clamp(1.0-mask,0.0,1.0);
	vec3 col1 = vec3(0.8,0.5+sin(uv.y),0.1)*mask;	
	return col1;
}


void main(void)
{
    vec2 uv = (gl_FragCoord.xy - resolution * .5) / resolution.yy;
    uv =fract(8.*uv); 
	
    float len = length(uv);
   
    
    vec3 col1 =  ddd(vec2(uv-vec2(0.5,0.5)) );
    float nt2 = (len*2.0) ;
  	
	uv = gl_FragCoord.xy/resolution.xy;
	uv.x *= 1.1;
	col1+=giga(uv-vec2(0.02,0.02));
	
	
	 
    gl_FragColor  = vec4( col1,1.0);
}