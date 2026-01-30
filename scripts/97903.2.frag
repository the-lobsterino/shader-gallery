
precision highp float;
 
 
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;
 
 
#define iResolution resol()
#define res resolution
#define iTime time
#define iMouse mouse
 
 
vec2 resol() {
    return resolution/1.55;
}
 
 
 
 
mat2 roti(float a) {
    float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}
 
//---------------------------------------------------------------
 
float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}


float hash(float p)
{
    p*=1234.5678;
    p = fract(p * .1031);
    p *= p + 33.33;
    return fract(2.*p*p);
}

vec3 hr(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


#define fxrand floor(time*5.)
#define hash1 hash(fxrand)
#define hash2 hash(fxrand+.12)
#define hash3 hash(fxrand+.23)
#define hash4 hash(fxrand+.34)
#define hash5 hash(fxrand+.45)
#define hash6 hash(fxrand+.56)
#define hash7 hash(fxrand+.67)


vec3 pos;

mat2 rot(float a) {
	float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float de(vec3 p) {
    p.xz*=rot(time*1.);
    p.yz*=rot(sin(time));
	float t=-sdTorus(p,vec2(2.3,2.));
    p.y=fract(p.y*3.)-.5;
    float f=max(length(p.xz)-1.,abs(p.y)-.1);
    //return min(t,f);
	pos=p;
	return t;
}


vec3 march(vec3 from, vec3 dir) {
    float td=0., g=0.;
    vec3 p;
    for (int i=0; i<50; i++) {
    	p=from+dir*td;
        p.x+=sin(p.y*4.+iTime*.8)*.15;
        p.z+=p.y*1.5;
        //p.xz*=rot(-iTime*.3+length(p.xz));
        float d=de(p);
        if (d<.01) break;
        g++;
        td+=d;
    }
    //p-=dir*.1;
//    return smoothstep(.3,0.,abs(.5-fract(p.y*15.)))*exp(-.03*td*td)*sin(p.y*10.+iTime*10.)+g*g*.00008;
    //float m=1000.;
    //p.y+=iTime*.03;
    p=pos;
	p.y+=iTime*.04*sign(p.y+.5);
    p*=.002;
    //p=abs(.5-fract(p));
    float o=1000.;
    
	for (int i=0; i<18; i++){
        vec2 c=p.xy-2.-hash3;
        if (hash7>.5) {
            if (p.x<p.y) p.x=c.y, p.y=c.x;
        }
        else {
            if(p.x<p.y) p.x=c.y, p.y=c.x;
        }
        p=abs(p)*1.6-3.-hash2;
        o=min(o,abs(length(p)-hash6));
    }
    float m=length(p);
    //m=smoothstep(2.,3.,m);
    //o=smoothstep(.0,.2,o);
    
    vec3 col = 1.-o*exp(-.05*td*td)*hr(vec3(hash1,.5,1.));
	col.rb*=rot(time*5.+pos.z);
	col*=exp(-.4*td)*2.;
	return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv=fragCoord/iResolution.xy-.5;
    uv.x*=iResolution.x/iResolution.y;
	float t=iTime*.1;
	vec3 from=vec3(0.,0.,-3.);
    vec3 dir=normalize(vec3(uv,.3+tan(time)*.0));
    float ro=(.5-hash4)*.5;
    dir.xz*=rot(ro);    
    dir.yz*=rot(sin(time));    
    from.xz*=rot(ro);

	vec3 col=march(from,dir);
	//col.rb*=rot(time*1.+pos.y*.2+col.g*10.);
	//col=sin(col*4.+time-pos.z*.5);
	//col=abs(col);
	col=col*col*3.;
    fragColor=vec4(col,1.);
}

//---------------------------------------------------------------
 
 
 
void main(void)
{
    vec2 uv = gl_FragCoord.xy/resolution.xy-.5;
    float ap=resolution.x/resolution.y;
    ap=1.;
    uv.x*=ap;
    uv*=1.55;
    uv+=vec2(-.07,.17);
    vec3 col=vec3(0.);
    vec4 fragColor=vec4(0);
    if ((uv.x<.5*ap&&uv.x>-.5*ap&&uv.y<.5&&uv.y>-.5)) {
        mainImage(fragColor,(uv+=.5)*iResolution);       
        col = fragColor.rgb;
    } else {
        uv*=.02;
        mainImage(fragColor,(uv+=.5)*iResolution);       
        col = fragColor.rgb;
        
    }
    gl_FragColor = vec4(col,1);
}

