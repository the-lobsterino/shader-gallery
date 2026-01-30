#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D iChannel0, iChannel1, bb;

varying vec2 surfacePosition;
varying vec2 surfaceSize;


vec3   iResolution = vec3(resolution, 1.0);
float  iGlobalTime = time+atan(sin(2.*time)*cos(0.5*time));
vec4   iMouse = vec4(mouse, 0.0, 1.0);

float zz = sin(atan(1.706962325*iGlobalTime)*iGlobalTime)+sin(iGlobalTime*1.3)+(0.545*iGlobalTime)+time;
float z1z = 1.5*atan(cos(.3725*zz)/sin(2.3*zz)*iGlobalTime)+cos(zz*1.3)+(0.545*time)-zz-iGlobalTime*(zz*0.060625)+(iGlobalTime*0.5);
float z2z = 2.*cos(sin(0.67235706962325/z1z)/zz)+atan(z1z/1.3)+(0.545/atan(zz))/z1z+zz;
float pew = sin(iGlobalTime*time/zz)*z1z+time;
// I used iChannelTime to try a way for moving arbitrarily in a 3d enviroment. 
// Just an experiment, code is based on "Infinite Fractal Roads" shader

const int Iterations=35;
const float width=2.28432;
const float detail=.00001598613;
const float Scale=2.4613234242;

vec3 lightdir=normalize(vec3(pew*0.,pew*-0.3,pew*-1.)*zz);
vec3 skydir=normalize(vec3(0.,-1.,0.));

float ot=0.;
float det=0.;

float de(vec3 p) {
	float DEfactor=Scale;
	ot=1000.;
	for (int i=0; i<Iterations; i++) {
		p = vec3(2.)-abs(abs(p)-vec3(2.));  
		float r2 = dot(p,p);
		ot = clamp(abs(ot-1.),0.,r2);
		p*=Scale/clamp(r2,0.02,1.); 
		DEfactor*=Scale/clamp(r2,0.02,1.);
		p = p + vec3(2.,-5.5,3.);
	}
	return (length(p.yz)-10.)/DEfactor;
}



vec3 normal(vec3 p) {
	vec3 e = vec3(0.0,det,0.0);
	
	return normalize(vec3(
			de(p+e.yxx)-de(p-e.yxx),
			de(p+e.xyx)-de(p-e.xyx),
			de(p+e.xxy)-de(p-e.xxy)
			)
		);	
}

float AO( const vec3 pos, const vec3 nor ) {
	float aodet=detail*50.;
	float totao = 0.0;
    float sca = 20.0;
    for( int aoi=0; aoi<6; aoi++ ) {
        float hr = aodet*float(aoi*aoi);
        vec3 aopos =  nor * hr + pos;
        float dd = de( aopos );
        totao += -(dd-hr)*sca;
        sca *= 0.7;
    }
    return clamp( 1.0 - 6.0*totao, 0., 1.0 );
}


vec3 light(in vec3 p, in vec3 dir) {
	vec3 n=normal(p);
	float ao=AO(p, n);
	float diff=max(0.,dot(lightdir,-n))*ao;
	float amb=(.25*max(0.,dot(dir,-n))+.25*max(0.,dot(normalize(skydir),-n)))*ao;
	vec3 r = reflect(lightdir,n);
	float spec=max(0.,dot(dir,-r));
	return (diff+pow(spec,10.)*ao)*vec3(1,.9,.65)+amb*vec3(.8,.9,1.);	
		}

vec3 raymarch(in vec3 from, in vec3 dir) 
{
	float st,d=1., totdist=st=0.;
	vec3 p, col;
	for (int i=0; i<200; i++) {
		if (d>det && totdist<3.) {
			p=from+totdist*dir;
			d=de(p);
			det=detail*(1.+totdist*50.);
			totdist+=d; 
			st+=max(0.,.01-d)*exp(-2.*totdist);
		}
	}
	float l=pow(max(0.,dot(normalize(-dir),normalize(lightdir))),3.);
	vec3 backg=(1.+l*l)*.5+vec3(1.,.9,.7)*l*.2;
	if (d<det) {
		ot=clamp(ot*1.5,0.5,1.);
		col=vec3(ot,ot*ot,ot*ot*ot)*2.;
		col*=light(p-(det-d)*dir*1.5, dir); 
		col = mix(col, backg, 1.0-exp(-1.5*totdist*totdist));
	} else { 
		col=backg*(1.+texture2D(iChannel0,dir.xy*.5-vec2(0.,z2z*.0671)).z*.0140116425);
		col+=vec3(1,.85,.7)*pow(max(0.,dot(dir,-lightdir)),300.)*13.19725;
	}

	return col+st*vec3(1.,.95,.8);
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy*4.-2.;
	uv.y*=iResolution.y/iResolution.x;
	uv.y-=.5*sin(time*.2355);
	float x=sin(z2z*0.00087160)-cos(z1z*.000936234);
	vec3 from=vec3(x*.05,0.248725*atan(sin(.16258*(0.16*zz)/z1z)*0.00063423475503)-.9876432594916299964001112875,-3.4324315465734318+z1z*.00000557892);
	vec3 dir=normalize(vec3(uv*.8,1.));
	float a1=(iMouse.x/iResolution.x-.5)*3.1416*2.;
	float a2=(iMouse.y/iResolution.y-.5)*3.1416;
	if (iMouse.z<.1) a1=a2=0.;
	dir.yz*=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	dir.xz*=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	vec3 col=raymarch(from,dir); 
	col=col*vec3(1.1,1.03,1.)*.7+vec3(.05,.02,.0);
	gl_FragColor = vec4(col,1.);
}
