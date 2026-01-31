/*
 * Original shader from: https://www.shadertoy.com/view/tllfRS
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
#define S(x,y,z) smoothstep(x,y,z)
#define AR (iResolution.x/iResolution.y)

#define pUP 0
#define pEND 1
#define pLEFT 2
#define pRIGHT 3
#define pFLEFT 4
#define pFRIGHT 5

// https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float dist(vec2 uv,vec2 x)
{
	return length(uv-x*vec2(1.0,1.0/AR));
}

vec3 circle(vec2 uv,float r, float lt)
{
    float lb = 0.005; // line blur
    float d = dist(uv,vec2(0.5));
    return vec3(min(S(r-lb-lt,r-lt,d),S(r+lb+lt,r+lt,d)));
}

vec3 lineUp(vec2 uv, float lt /*line thickness*/)
{
    float lb = 0.005; // line blur
    return vec3(min(S(0.5-lb-lt,0.5-lt,uv.x),S(0.5+lb+lt,0.5+lt,uv.x)));
}

vec3 lineLeft(vec2 uv, float lt)
{
    vec3 colUp = lineUp(uv,lt);
    float lb = 0.005; // line blur
    
    lt += 0.001;
    vec3 colDiag = vec3(min(S(1.0-lb-lt,1.0-lt,uv.x+uv.y),S(1.0+lb+lt,1.0+lt,uv.x+uv.y)));
    
    return mix(colUp,colDiag,S(0.5,0.51,uv.y));
}

vec3 lineFromLeft(vec2 uv, float lt)
{
    uv.y = 1.0-uv.y;
    return lineLeft(uv,lt);
}

vec3 lineRight(vec2 uv, float lt)
{
    uv.x = 1.0-uv.x;
    return lineLeft(uv,lt);
}

vec3 lineFromRight(vec2 uv, float lt)
{
	uv.y = 1.0-uv.y;
    return lineRight(uv,lt);
}

vec3 lineEnd(vec2 uv, float lt, float lp /* line percent*/)
{
    lp /= AR;
    vec3 lineCol = lineUp(uv,lt);
    
    float circleR = 0.1;
    vec2 circleUV = uv;
    circleUV.y += 0.5*(1.0/AR);
    circleUV.y -= circleR+lt;
    circleUV.y -= lp;
    vec3 circleCol = circle(circleUV,circleR,lt);
    
    return mix(lineCol,circleCol,S(lp-0.01,lp,uv.y));
}

int calcType(vec2 id)
{
    float r = rand(id);
    
    if(r > 0.5) return pUP;
    else if(r > 0.3) return pEND;
    else if(r > 0.15) return pFLEFT;
    else return pFRIGHT;
}

int getType2(vec2 id)
{
    return calcType(id);
}

int getType1(vec2 id)
{
    int upType = getType2(id+vec2(0.0,1.0));
    int ulType = getType2(id+vec2(-1.0,1.0));
    int urType = getType2(id+vec2(1.0,1.0));
    
    int type = calcType(id);
    
    if(ulType == pFRIGHT) return pLEFT;
    if(urType == pFLEFT)  return pRIGHT;
    if(upType == pFLEFT || upType == pFRIGHT) return pUP;
    if(upType == pUP && type == pUP) return pUP;
    
	return type;
}

int getType0(vec2 id)
{
    int upType = getType1(id+vec2(0.0,1.0));
    int ulType = getType1(id+vec2(-1.0,1.0));
    int urType = getType1(id+vec2(1.0,1.0));
    
    int type = calcType(id);
    
    if(ulType == pFRIGHT) return pLEFT;
    if(urType == pFLEFT)  return pRIGHT;
    if(upType == pFLEFT || upType == pFRIGHT) return pUP;
    if(upType == pUP && type == pUP) return pUP;
    
	return type;
}

int getType(vec2 id)
{
    int upType = getType0(id+vec2(0.0,1.0));
    int ulType = getType0(id+vec2(-1.0,1.0));
    int urType = getType0(id+vec2(1.0,1.0));
    
    int type = calcType(id);
    
    if(ulType == pFRIGHT) return pLEFT;
    if(urType == pFLEFT)  return pRIGHT;
    if(upType == pFLEFT || upType == pFRIGHT) return pUP;
    if(upType == pUP && type == pUP) return pUP;
    
	return type;
}

vec3 getColor(vec2 id)
{
    int type = getType(id);
    for (int t = 0; t < 6; ++t)
    {
        if (type == pEND) break;
        id.y+=1.0;
        if(type==pRIGHT) id.x += 1.0;
        else if(type==pLEFT) id.x -= 1.0;
        type = getType(id);
    }
    
    float r = fract(rand(id)*231.0);
    r = 0.5*r + 0.1;
    
    
    vec3 hsvColor = vec3(r,0.7,0.9);
    return hsv2rgb(hsvColor);
}

vec3 linesLayer(vec2 uv,vec2 id)
{
    vec3 col = vec3(0.0);
    
    int type = getType(id);
    
    float lt = 0.03;
    
    if(type==pUP) col = lineUp(uv,lt);
    else if(type==pEND) col = lineEnd(uv,lt,0.5);
    else if(type==pLEFT) col = lineLeft(uv,lt);
   	else if(type==pRIGHT) col = lineRight(uv,lt);
   	else if(type==pFRIGHT) col = lineFromRight(uv,lt);
   	else if(type==pFLEFT) col = lineFromLeft(uv,lt);
    
    col *= getColor(id);
        
   	return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = 0.15*iTime;
    vec2 globalUV = fragCoord/iResolution.xy;
    globalUV.y /= AR;
    globalUV.x += 0.2*globalUV.y;
    vec2 uv = globalUV;

    uv.y -= t;
    
    uv *= vec2(10.0+2.5*globalUV.y,16.0);
    
    vec2 id = floor(uv);
    uv = fract(uv);
    
    float rnd = rand(id);
    
    vec3 col = vec3(0.0);
    
	col = linesLayer(uv,id);
        
    vec3 bgMask = vec3(1.0)-col;
    
    bgMask *= abs(sin(1.2*6.18*globalUV.x));
    bgMask = clamp(bgMask,0.7,0.85);
    
    for(float y = 0.1;y<1.0;y+=0.2)
    	bgMask *= max(S(0.03,0.1,uv.y-y),S(0.1,0.05,uv.y-y));
       
    vec3 bgColor = hsv2rgb(vec3(0.3,0.7,0.4));
    bgColor -= vec3(0.1 + 0.05*sin(id.x));
    
    col += bgMask*bgColor;    
    
    //if(uv.x > 0.98 || uv.y > 0.98) col.r = 1.0;
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}