#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//original from: https://www.shadertoy.com/view/ltVyWh
//Smooth min from iq: https://www.iquilezles.org/www/articles/smin/smin.htm
float smin( float a, float b, float k )
{
    float res = exp2( -k*a ) + exp2( -k*b );
    return -log2( res )/k;
}

//Distance function
float SDMere(vec3 pos, vec3 p, float r, float t){
    return
    smin(
    smin(
    length(max(abs(p-pos)-r+.05,0.0))-.05,
    distance(p,pos+.35*vec3(sin(2.5*t+.2),sin(5.*t),cos(3.*t)))-.1*r,
    20.),
    distance(p,pos+.35*vec3(cos(5.*t+.7),cos(2.*t),sin(3.5*t)))-.1*r,
    20.)
    ;
}

float SDscene(vec3 p, float t){
	float d = SDMere(vec3(0,0,0),p,.2,t);
	return d;
}

//SD normal
vec3 SDn(vec3 p, float t){
    float ep = 0.01;
    return normalize(vec3(
    SDscene(vec3(p.x+ep,p.y,p.z),t)-SDscene(vec3(p.x-ep,p.y,p.z),t),
    SDscene(vec3(p.x,p.y+ep,p.z),t)-SDscene(vec3(p.x,p.y-ep,p.z),t),
    SDscene(vec3(p.x,p.y,p.z+ep),t)-SDscene(vec3(p.x,p.y,p.z-ep),t)
    ));
}

//phong shading (currenty broken)
vec3 phong(vec3 p, float t){
    
    //Lights:
    //Lights position
    vec3 L1 = 3.*vec3(sin(2.5*t),cos(t),sin(t));
    float dt = t+2.;
    vec3 L2 = 3.*vec3(sin(2.5*dt),cos(dt),sin(dt));
    //Lights intensity
    vec3 i1s = vec3(1.);
    vec3 i1d = vec3(1.);
    vec3 ia = .4*vec3(1.);
    
    //Material:
    //Spectral lighting
    vec3 Tks = vec3(.7);
    //Diffuse lighting
    vec3 Tkd = .5*vec3(.9);
    vec3 Tka = 3.*vec3(.45);
    float alp = 100.;
    
    
    vec3 L1v = normalize(L1-p);
    vec3 L2v = normalize(L2-p);
    vec3 N = SDn(p, t);
    vec3 R1 = normalize(reflect(L1v,N));
    vec3 R2 = normalize(reflect(L2v,N));
    vec3 J,Q;
    float temp = dot(L1v,N);
    float stemp = dot(R1,L1v);
    if(temp>0.){J = Tkd*i1d*temp;}
    if(stemp>0.){Q = Tks*i1d*pow(stemp,alp);}
    float temp2 = dot(L2v,N);
    float stemp2 = dot(R2,L2v);
    if(temp2>0.){J += Tkd*i1d*temp2;}
    if(stemp2>0.){Q += Tks*i1d*pow(stemp2,alp);}
    
    //Iridescence: IN reality it should be a function of dot(incident,reflected), and is much more complex
    //"Thickness" of film
    float k = 10.;
    vec3 ir = Tka*ia*(.15*
         vec3(
         sin(k*temp)+sin(k*temp2),
         sin(k*temp+.75)+sin(10.*temp2+.75),
         cos(k*temp)+cos(k*temp2))
         +1.3);
    
    vec3 I = ir + J + Q;
    return I;
}


//raytracing
float end = 10.;
float depth(vec3 ro, vec3 rd, float t){
    float dist=0., d;
    int max=200;
    float ep = 0.0001;
    for (int i=0; i<200; i++){
    d = SDscene(ro + dist*rd, t);
    if (d<ep){
        return dist;
    }
    dist += d;
    if (dist > end){
        return end;
    }
  }
}

void main( ) {
    
    //Shader setup
    vec2 R = resolution.xy;
    vec2 S = gl_FragCoord.xy;
    vec2 uv = (S / R-.5)*.75;
    uv.y *= R.y/R.x;
    vec2 T = mouse.xy/5.;
    float t = .2*time - 20.;
	
    //Camera setup
  	float zoom = 5.;
  	vec3 ro = 2.*vec3(sin(T.x+t*.2)*cos(T.y+t*.3),sin(T.x+t*.2)*sin(T.y+t*.3),cos(T.x+t*.2));
  	vec3 lookat = vec3(0,0,0);
  	vec3 fw = normalize(lookat - ro);
  	vec3 r = normalize(cross(vec3(0,1.,0), fw));
  	vec3 up = normalize(cross(fw,r));
  	vec3 scrC = ro + (zoom)*fw + up*0.;
  	vec3 scrP = scrC + 4.*(uv.x*r + uv.y*up);
  	vec3 rd = normalize(scrP - ro);
  	vec4 Color;
  	float d = depth(ro,rd,t);
  	if (d<end){
  		vec3 p = d*rd + ro;
  		Color = vec4(phong(p,t),1.);
  	}
  	else{Color = 2.*vec4(.9,.8,.8,1.);}

  	//vigillant
  	Color *= sqrt(.65-1.*length(uv));
  	
    gl_FragColor = Color;

}