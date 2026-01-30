/*
 * Original shader from: https://www.shadertoy.com/view/tdBfDW
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //

// 
// friol 2o2o
// a night-ish trip into flashing neon lights
// music is generated
// sdf functions by iq
// pModPolar by mercury
// beware of nicolas winding refn inner jokes
// 25.05.2020: the bassline was going nuts after the first measures. Should be fixed.
// 25.05.2020: same thing for the saw synth
//

#define PI 3.1415926535
#define TAU 6.2831853071

// rainbow function

vec3 palette (float t, vec3 a, vec3 b, vec3 c, vec3 d)
{
    return a+b*cos(TAU*(c*t+d));
}

const int sdfIterationsAmount=256;
float baryyy=0.0;

vec3 rotx(in vec3 p, float a) 
{
	return vec3(p.x,
                cos(a) * p.y + sin(a) * p.z,
                cos(a) * p.z - sin(a) * p.y);
}

vec3 roty(in vec3 p, float a) {
	return vec3(cos(a) * p.x + sin(a) * p.z,
                p.y,
                cos(a) * p.z - sin(a) * p.x);
}

vec3 rotz(in vec3 p, float a) {
	return vec3(cos(a) * p.x + sin(a) * p.y,
                cos(a) * p.y - sin(a) * p.x,
                p.z);
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float sdPlane( vec3 p, vec4 n )
{
    return dot(p,n.xyz) + n.w;
}

float sdRoundedCylinder( vec3 p, float ra, float rb, float h )
{
  vec2 d = vec2( length(p.xz)-2.0*ra+rb, abs(p.y) - h );
  return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}

float pModPolar(inout vec2 p, float repetitions, int mode) {
	float angle = TAU/repetitions;
	float a = atan(p.y, p.x) + angle/2.;
	float r = mode==0?length(p):length(cos(p.x)*sin(p.y));
	float c = floor(a/angle);
	a = mod(a,angle) - angle/2.;
	p = vec2(cos(a), sin(a))*r;
	return c;
}

// noby
float spacehash(vec3 p3)
{
    p3 = fract(p3*.1031);
	p3 += dot(p3,p3.yzx+19.19);
    return fract((p3.x+p3.y)*p3.z);
}

// starts at 48.0, ends at 64.0
vec3 SDFNeonGeometry(vec3 r) // triangles, quads, etc., water below
{
    float t=10000.0;
    const float attenuation=15.2;

    vec3 cellId=floor(vec3(r.x-3.0,0.0,r.z-3.0)/12.0);
    float hsh=spacehash(cellId);
    
    vec3 c=vec3(6.0,0.0,6.0);
    r = mod(r+0.5*c,c)-0.5*c;
    //r=r-vec3(0.0,.0,0.0);
    r=rotz(r,iTime*2.0*(-0.5+hsh));
    
    pModPolar(r.xy,abs(cellId.x)+3.0,0);
    
    float neonBar=sdRoundedCylinder(r-vec3(0.8,0.0,0.0),0.012,0.035,1.4);
    //float neonBar=sdTorus(r-vec3(0.0,.4,0.0),vec2(1.1,0.05));
    t=min(t,neonBar);
    
    float glow = 1. / ( 1.0 + pow(abs(t*attenuation),.63));
    return vec3(t,2.0,glow);
}

// triangle scene with rainbow neon - 64.0 - 80.0
vec3 SDFNeonRainbowTriangles(vec3 r)
{
    float t=10000.0;
    const float attenuation=150.0;

    baryyy=atan(r.z,r.y);
    
    vec3 cellId=floor(vec3(r.x-6.0,0.0,r.z-6.0)/12.0);
    float hsh=spacehash(cellId);
    
    vec3 c=vec3(0.0,0.0,12.0);
    r = mod(r+0.5*c,c)-0.5*c;
    r=r-vec3(0.0,1.0,0.0);
    r=rotz(r,3.141592/2.0+(iTime*(hsh-0.5)));
    
    pModPolar(r.xy,3.0,0);
    
    float neonBar=sdRoundedCylinder(r-vec3(0.8,0.0,0.0),0.012,0.035,1.5);
    t=min(t,neonBar);
    
    float glow = 1. / ( 1.0 + pow(abs(t*attenuation),.63));
    return vec3(t,2.0,glow);
}

// a shitload of circles
vec3 SDFNeonCircles(vec3 r)
{
    const float attenuation=350.2;

    vec3 cellId=floor(vec3(r.x-3.0,0.0,r.z-3.0)/12.0);
    float hsh=spacehash(cellId);
    
    vec3 c=vec3(0.0,0.0,6.0);
    r = mod(r+0.5*c,c)-0.5*c;
    r=rotz(r,iTime*(-0.5+hsh));
    
    pModPolar(r.xy,17.0,2);
    
    // change 0.8 to 0.1 for squares
    float neonBar=sdRoundedCylinder(r-vec3(0.8,.0,0.0),0.012,0.035,1.4);
    
    float t=min(10000.0,neonBar);
    float glow = 1. / ( 1.0 + pow(abs(t*attenuation),.63));
    return vec3(t,2.0,glow);
}

// flying birds/waveforms scene
vec3 SDFNeon(vec3 r)
{
    float t=10000.0;
    float attenuation=85.0-80.0*sin(iTime*13.0);

    vec3 cellId=floor(vec3((r.x-2.0)*8.0,0.0,r.z-4.0)/8.0);
    float hsh=spacehash(cellId);

    if (iTime<16.0) r.y*=0.5;
    vec3 c=vec3((iTime<16.0)?1.0:8.0,0.0,16.0);
    r = mod(r+0.5*c,c)-0.5*c;

    float period=(iTime<16.0)?(hsh+iTime)*6.5:iTime*2.0;
    vec3 r1=r-vec3(0.0,0.0,1.0);
    r1=rotz(r,3.141592/2.0+sin(period));
    vec3 r2=r-vec3(0.0,0.0,-1.0);
    r2=rotz(r,3.141592/2.0-sin(period));
    
    // birds/waves

    float neonBar=sdRoundedCylinder(r1-vec3(0.0,.5,0.0),0.012,0.035,.5);
    t=min(t,neonBar);
    float neonBar2=sdRoundedCylinder(r2-vec3(0.0,-.5,0.0),0.012,0.035,.5);
    t=min(t,neonBar2);
    
    float glow = 1. / ( 1.0 + pow(abs(t*attenuation),.63));
    return vec3(t,2.0,glow);
}

vec3 SDFMainScene(vec3 r)
{
    float t=10000.0;

    if (iTime>80.0) return vec3(-1.0);
    
    float basePlane=(iTime>48.0)?sdPlane(r-vec3(0.0,-0.1*sin(r.x*10.0)*0.1*cos(r.z*10.0),0.0),vec4(0.0,1.0,0.0,1.0)):sdPlane(r-vec3(0.0,-0.9,0.0),vec4(0.0,1.0,0.0,1.0));
    t=min(t,basePlane);
    
    // for birds scene
    float sphere=((iTime>=8.0)&&(iTime<48.0))?sdSphere(r-vec3(0.0,(iTime<16.0)?1.0:0.0,.0+(iTime*8.0)+((iTime-22.0)/2.0)),1.0):10000.0;
    t=min(t,sphere);

    if (t==basePlane) return vec3(t,1.0,0.0);
    if (t==sphere) return vec3(t,2.0,0.0);
    
    return vec3(-1.0);
}

//
//
//

vec3 fog(vec3 c, float dist, vec3 fxcol)
{
    float fogAmount = 1.0 - exp(-dist * 0.035);
    return mix(c, fxcol, fogAmount);
}

vec3 calcNormal(vec3 pos)
{
	vec3 n = vec3(0.0);
    for( int i=0; i<4; i++ )
    {
        vec3 e = 0.5773*(2.0*vec3(( mod(float((i+3)/2),2.0) ),(mod(float(i/2),2.0)),(mod(float(i),2.0)))-1.0);
        n += e*SDFMainScene(pos+0.0005*e)[0];
    }
    return normalize(n);
}

vec4 rayMarch(vec3 rayOrigin, vec3 rayDir)
{
    float glow=0.0;
    float t=0.0;
    
    // neon bars
    vec3 curPoint = rayOrigin+rayDir ;
    for (int i=0;i<sdfIterationsAmount;i++)
    {
        vec3 sdfRes = (iTime<48.0)?SDFNeon(curPoint):(iTime<64.0)?SDFNeonGeometry(curPoint):(iTime<80.0)?SDFNeonRainbowTriangles(curPoint):SDFNeonCircles(curPoint);
        float d=distance(curPoint,rayOrigin);
        glow+=sdfRes[2]/((d*0.08+1.0)*(d*0.08+1.0));
        curPoint+=rayDir*sdfRes[0];
    }

    // main scene part
    vec3 res;
    curPoint = rayOrigin+rayDir ;
    for (int i=0;i<sdfIterationsAmount;i++)
    {
        res = SDFMainScene(curPoint);
        if (res[0] < (0.00001*t))
        {
    		return vec4(t,res[1],glow,0.0);
        }
        
        curPoint+=rayDir*res[0];
        t+=res[0];
    }
    
    return vec4(-1.0,-1.0,glow,0.0);
}

vec3 reflekt(vec3 rayOrigin, vec3 rayDir)
{
    vec3 col=vec3(0.);
    vec4 rayHit = rayMarch(rayOrigin, rayDir);

    float glowIntensity=rayHit[2];
    if ((iTime>=64.0)&&(glowIntensity!=0.0))
    {
		vec3 barColor = palette(1.0-baryyy, 
                           vec3(0.5),
                           vec3(0.5),
                          vec3(0.5),
                          vec3(0.,0.3+iTime*0.5,0.7));        
		col+= vec3(glowIntensity)*barColor;
    }
    else if (glowIntensity!=0.0) // blue-purple neon 
    {
        vec3 barColor=mix(vec3(.3,.1,.3),vec3(.1,.1,.3),1.0-abs(sin(iTime)));
		col+= vec3(glowIntensity)*barColor;
    }
    
    //if (iTime<2.0) col.xyz*=(iTime/2.0);
    //col=pow(col,vec3(0.78));
    return col;
}

vec4 render(vec3 rayOrigin, vec3 rayDir, vec2 uv, vec2 fragCoord)
{
    vec3 fogColor=vec3(0.02,0.1,0.2);
    vec3 col=fogColor;
    vec3 L=normalize(vec3(0.0,.7,-5.0));
    
    vec4 rayHit = rayMarch(rayOrigin, rayDir);
    
    float mat=rayHit[1];
    vec3 pHit=rayOrigin+rayDir*rayHit[0];

    vec3 N=calcNormal(pHit);
    float dotprod=max(dot(N,L),0.0);

    vec3 refcol=reflekt(pHit,normalize(reflect(rayDir,N)));
    
    if (mat==1.0) // floor
    {
        col=mix(col,refcol,0.5)*0.1;
        col=fog(col,distance(rayOrigin,pHit),fogColor);
    }
    else if (mat==2.0)
    {
        col=refcol.xyz*pow(dotprod,256.0)*8.0;
    }

    float glowIntensity=rayHit[2];
    if ((iTime>64.0)&&(glowIntensity!=0.0)) // rainbow neon bar
    {
        //vec3 pBar=rayOrigin+rayDir*rayHit[3];
		vec3 barColor = palette((baryyy), 
                           vec3(0.5),
                           vec3(0.5),
                          vec3(0.5),
                          vec3(0.,0.3+iTime*0.5,0.7));        
		col+= vec3(glowIntensity)*barColor;
        //col=fog(col,distance(rayOrigin,pBar),fogColor);
    }
    else if (glowIntensity!=0.0) // neon bar
    {
        vec3 barColor=(iTime<48.0)?mix(vec3(.5,.3,.5),vec3(.3,.3,.5),1.0-abs(sin(iTime))):mix(vec3(.3,.1,.3),vec3(.1,.1,.3),1.0-abs(sin(iTime)));
		col+= 1.4*vec3(glowIntensity)*barColor;
    }
    
    col=pow(col,vec3(0.78));
    return vec4(col,1.0);
}

vec3 getCameraRayDir(vec2 uv, vec3 camPos, vec3 camTarget)
{
    vec3 camForward = normalize(camTarget - camPos);
    vec3 camRight = normalize(cross(vec3(0.,1.,0.), camForward));
    vec3 camUp = normalize(cross(camForward, camRight));
    return normalize(uv.x * camRight + uv.y * camUp + camForward * 2.0);
}

vec2 normalizeScreenCoords(vec2 screenCoord)
{
    vec2 result = 2.0*(screenCoord/iResolution.xy - 0.5);
    result.x *= iResolution.x/iResolution.y;
    return result;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float myTime=iTime*8.0;
	vec2 uv = normalizeScreenCoords(fragCoord);

    vec3 camPos,camTarget;

    if (iTime<16.0) // intro, waveforms
    {
        camPos=vec3(8.0*sin(2.0),0.0,-5.5+myTime);
        camTarget=vec3(0.0,0.0,1.0+myTime);
    }
    else if ((iTime>=16.0)&&(iTime<24.0)) // sphere entering
    {
        camPos=vec3(0.0,2.0,-5.5+myTime);
        camTarget=vec3(0.0,0.0,1.0+myTime);
    }
    else if ((iTime>=24.0)&&(iTime<32.0)) // sphere from above
    {
        camPos=vec3(8.0*sin(-2.0),8.0*sin(2.0)-1.0,-5.5+myTime);
        camTarget=vec3(0.0,0.0,1.0+myTime);
    }
    else if ((iTime>=32.0)&&(iTime<48.0)) // rotate
    {
        camPos=vec3(0.0,8.0*sin((iTime-32.0)/8.0)+1.0,-5.5+myTime);
        camTarget=vec3(0.0,0.0,3.0+myTime);
    }
    else if ((iTime>=48.0)&&(iTime<52.0)) // center square
    {
        camPos=vec3(0.0,0.0,-5.5+myTime*1.52);
        camTarget=vec3(0.0,0.0,3.0+myTime*1.52);
    }
    else if ((iTime>=52.0)&&(iTime<56.0)) // center triangle
    {
        camPos=vec3(6.0,0.0,-5.5+myTime*1.52);
        camTarget=vec3(6.0,0.0,3.0+myTime*1.52);
    }
    else if ((iTime>=56.0)&&(iTime<60.0)) // center pentagon
    {
        camPos=vec3(-12.0,0.0,-5.5+myTime*1.52);
        camTarget=vec3(-12.0,0.0,3.0+myTime*1.52);
    }
    else if ((iTime>=60.0)&&(iTime<64.0)) // center square
    {
        camPos=vec3(0.0,0.0,-5.5+myTime*1.52);
        camTarget=vec3(0.0,0.0,3.0+myTime*1.52);
    }
    else
    {
        camPos=vec3(0.0,2.5,-5.5+myTime);
        camTarget=vec3(0.0,0.0,myTime);
    }
    
    vec3 rayDir = getCameraRayDir(uv, camPos, camTarget);   
    vec4 finalCol=vec4((render(camPos, rayDir,uv,fragCoord).xyz),1.0);

    if (iTime<2.0) finalCol.xyz*=(iTime/2.0);
    if (iTime>=88.0) finalCol.xyz*=max((4.0-(iTime-88.0))/4.0,0.0);
    fragColor=finalCol;
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}