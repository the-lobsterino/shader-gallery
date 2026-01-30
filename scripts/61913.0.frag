#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.0);
vec3 lightpos,schein;
vec3 lightdir = vec3(0,0,1);
float scatter;
float rnd(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.98,78.23))) * 43758.54);
}
float sdBox(vec3 p,vec3 b)
{
  vec3 d = abs(p)-b;
  return min(max(d.x,max(d.y,d.z)),0.)+length(max(d,0.));
}
float noise(vec3 p)
{
	vec3 ip = floor(p);
    p -= ip; 
    vec3 s = vec3(7,157,113);
    vec4 h = vec4(0.,s.yz,s.y+s.z)+dot(ip,s);
    p = p*p*(3.-2.*p); 
    h = mix(fract(sin(h)*43758.5453), fract(sin(h + s.x)*43758.5453), p.x);
    h.xy = mix(h.xz,h.yw,p.y);
    return mix(h.x,h.y,p.z); 
}
float sdCone( vec3 p, vec2 c,float le )
{
    float f1 = dot(c,vec2(max(length(p.xy),le),p.z*1.1));
    float f2 = dot(c,vec2(length(p.xy),p.z));

    return max(-f1,f2);
}
void pR(inout vec2 p,float a) 
{
	p = cos(a)*p+sin(a)*vec2(p.y,-p.x);
}
float mapScene(in vec3 p) 
{

    pR(p.zy,iTime*0.35);
    pR(p.zx,0.18*iTime);
 	float d = sdBox(p,vec3(0.4))-0.03;
    float d2 = sdBox(p,vec3(0.3,0.3,1.0));
    float d3 = sdBox(p,vec3(1.0,0.3,0.3));
    float d4 = sdBox(p,vec3(0.3,1.0,0.3));
    d= max(d,-d2);
    d= max(d,-d3);
    return max(d,-d4)+0.02*noise(20.*p);
}
float castRayShadow(in vec3 ro, in vec3 rd) 
{
    float precis = 0.0001;
    float h = precis * 2.0;
    float t = 0.;
    for(int i = 0; i < 200; i++) 
    {
    	if(abs(h) < precis || t > 3.) continue;
        h = mapScene(ro+rd*t);
        t += .06*h;
    }
    return t;
}
float map(in vec3 p, int vol) 
{
   float d= mapScene(p);
    if (vol==1)
    {
    	schein=(p-lightpos);
  	pR(schein.zx,sin(iTime*-0.3));
    pR(schein.yz,sin(iTime*1.3));
        float so = sdCone(schein,normalize(vec2(1,.7)),10.);
   		float le=0.;
        if (so<-0.0) le=castRayShadow(normalize(p),normalize(-p+lightpos));
        float s = sdCone(schein,normalize(vec2(1,.9)),le)/length(schein*schein)+0.1*noise(10.*p-0.13*iTime)-0.21*noise(p*23.);
		scatter += max(-s,0.)*.6;
    }
    float f = length(p-lightpos)-0.2; 
    return min(f,d);
}

float castRay(in vec3 ro, in vec3 rd, in float maxt, in float co,in int vol) {
    float precis = 0.001;
    float h = precis * 2.0;
    float t = co;
    for(int i = 0; i < 100; i++) 
    {
    	if(abs(h) < precis || t > maxt) continue;
        h = map(ro+rd*t,vol);
        t += 0.5*h;
    }
    return t;
}

vec3 calcNormal(vec3 pos)
{
    float eps = 0.1, d = map(pos,0);
	return normalize(vec3(map(pos+vec3(eps,0,0),0)-d,map(pos+vec3(0,eps,0),0)-d,map(pos+vec3(0,0,eps),0)-d));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
   
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;
    vec3 ro = vec3(0,0,-1.);
    vec3 rd = normalize(vec3(2.*gl_FragCoord.xy -iResolution.xy, iResolution.y));

    lightpos = vec3(0.2*cos(0.2*iTime),0.0 + 0.0 * sin(iTime*2.0),.3); 
    pR(lightdir.yz,sin(iTime*-1.3));
    pR(lightdir.zx,sin(iTime*0.3));

    vec3 col = vec3(0);
   	float t= castRay(ro, rd, 15.0,0.-rnd(uv+0.01*iTime)*1.,1);    
	float depth = clamp(t/5.-1.3,0.,1.);
	if (t>15.) t=1000000.; 
    vec3 pos = ro + rd * t;
    vec3 nor = calcNormal(pos);
    float ncol=0.;
    vec3 L = normalize(lightpos - pos);
    vec3 V = normalize(ro - pos);
    vec3 H = normalize(L+V);
    float NdotL = dot(nor,L);
    float NdotH = dot(nor,H);
    float conedot = dot(lightdir, normalize(L));
    float conecos = 0.7071;
    float cold = NdotL;
    float cols = pow(clamp(NdotH, 0.0, 1.0), 60.0);
    float cone =  1.;
    if (NdotL > 0.0 && conedot > conecos)
    {        
         cone =  pow((conedot-conecos)/(1.-conecos),4.);
         ncol = (cold + cols) * cone;
    }    
  
    col+=0.3*scatter*vec3(.6,.8,1.);
    col+= 5.7*vec3(1./16., 1./4., 2./1.)* exp(6.*(-1.+ncol)); 

    col = clamp(col,0.,1.);
 
	fragColor = vec4(col,depth*.0);
}
void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}