/*
 * Original shader from: https://www.shadertoy.com/view/tlKcW1
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,0.)

// --------[ Original ShaderToy begins here ]---------- //

//a walk at dawn...

//distance functions:
//https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm

float dCircle(in vec2 pos,in float size)
{
    return length(pos) - size;
}

float dSegment(in vec2 pos,in vec2 a,in vec2 b,in float size)
{
    vec2 pa = pos - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa,ba) / dot(ba,ba),0.0,1.0);
    return length( pa - ba * h) - size;
}

float pAdd(in float a,in float b)
{
    return min(a,b);
}

float pAdd(in float a,in float b,in float k) 
{
    float h = clamp(0.5 + 0.5 * (b - a) / k,0.0,1.0);
    return mix(b,a,h) - k * h * (1.0 - h); 
}

float pSub(in float a,in float b)
{
    return max(a,-b);
}

float pSub(in float a,in float b,in float k) 
{
    float h = clamp(0.5 - 0.5 * (b + a) / k,0.0,1.0);
    return mix(b,-a,h) + k * h * (1.0 - h); 
}

float pDif(in float a,in float b)
{
    return max(a,b); 
}

float pDif(in float a,in float b,in float k) 
{
    float h = clamp(0.5 - 0.5 * (b - a) / k,0.0,1.0);
    return mix(b,a,h) + k * h * (1.0 - h);
}

float pSmooth(in float val,in float factor)
{
    return smoothstep(factor,-(2.0 / iResolution.y),val);
}

vec3 cSky(in vec2 pos)
{
    vec3 color = vec3(mix(vec3(0.2,0.4,2.0),vec3(0.8,0.3,0.5),-pos.y + 0.6));
    color = mix(color,vec3(0.2,0.2,0.6),(abs(pos.y) * 1.2) - (abs(pos.x) / 1.3));
    color += pos.x / 10.0 + 0.2;
    color -= pos.y * 0.4;
    return color;
}

vec3 cTerrain(in vec2 pos)
{
    return vec3(exp(-pos.y + pos.x - 0.5),0.4 + (-pos.y * 1.0),1.0 + (pos.y * 0.5));
}

vec3 cPenguinBody(in vec2 pos)
{
    pos.y -= 0.2;//0.2 when the marked '*' line below is disabled / otherwise 0.3!
    vec3 color = vec3(0.1,0.2,0.2);
    color -= pos.y * 0.4 - abs(pos.y - 0.2) / 3.2;
    //color += pos.x * 2.3 + (pos.y * 0.1);//* (optional shading)
    return color;
}

vec3 cPenguinBeakAndFeet(in vec2 pos)
{
    pos.y += 0.6;
    return vec3(1.0,0.8 - (0.2 - (0.4 - pos.y)),0.4);
}

vec3 cPenguinBellyAndEyes(in vec2 pos)
{
   pos.y += 0.8;
   return vec3(1.0 - (0.1 - pos.y),1.8 - (1.0 - (pos.x - 0.5) - (pos.y / 1.2)),0.9);
}

vec4 sTerrain(in vec2 pos,in float factor)
{
    float sd = dCircle(pos - vec2(-0.4,-0.8),0.8);
    sd = pAdd(sd,dCircle(pos - vec2(0.4,-0.8),0.6),0.2);
    sd = pSmooth(sd,factor);
    return vec4(cTerrain(pos),sd);
}

vec4 sTerrain2(in vec2 pos,in float factor)
{
    float sd = dCircle(pos - vec2(0.3,-0.7),0.6); 
    sd = pAdd(sd,dCircle(pos - vec2(-0.4,-0.8),0.6),0.8);
    sd = pSmooth(sd,factor);
    return vec4(cTerrain(pos - vec2(0.0,0.1)),sd);
}

vec4 sTerrain3(in vec2 pos,in float factor)
{
    float sd = dCircle(pos - vec2(-0.6,-0.8),0.6);
    sd = pAdd(sd,dCircle(pos - vec2(0.2,-1.2),0.6),0.8);
    sd = pSmooth(sd,factor);
    return vec4(cTerrain(pos - vec2(0.0,-0.16)),sd);
}

vec4 sPenguinBody(in vec2 pos,in float factor)
{
    float sd = dCircle(pos,0.04);
    sd = pAdd(sd,dCircle(pos - vec2(0.0,-0.06),0.064),0.06);
    sd = pAdd(sd,dCircle(pos - vec2(0.0,0.03),0.03),0.02);
    sd = pAdd(sd,dCircle(pos - vec2(0.02,0.06),0.040),0.012);
    sd = pAdd(sd,dCircle(pos - vec2(-0.08,-0.08),0.01),0.04);
    sd = pSmooth(sd,factor);
    return vec4(cPenguinBody(pos - vec2(0.0,-0.2)),sd);
}

vec4 sPenguinArmRight(in vec2 pos,in float factor)
{
    float sd = dSegment(pos,vec2(0.0,0.014),vec2(0.1,-0.01),0.026 - abs(pos.x) / 7.0);
    sd = pSmooth(sd,factor);
    return vec4(cPenguinBody(pos - vec2(0.0,-0.2)),sd);
}

vec4 sPenguinBeakAndLegs(in vec2 pos,in float factor)
{
    float sd = dSegment(pos,vec2(0.048,0.062),vec2(0.058,0.055),0.01);
    sd = pSub(sd,dSegment(pos,vec2(0.05,0.040),vec2(0.08,0.040),0.01));
    sd = pAdd(sd,dSegment(pos,vec2(0.006,-0.114),vec2(0.04,-0.12),0.014));
    sd = pSub(sd,dSegment(pos,vec2(0.0,-0.04),vec2(0.1,-0.2),0.01));
    sd = pSmooth(sd,factor);
    return vec4(cPenguinBeakAndFeet(pos),sd);
}

vec4 sPenguinBellyAndEyes(in vec2 pos,in float factor)
{
    float sd = dCircle(pos,0.04);
    sd = pAdd(sd,dCircle(pos - vec2(0.0,-0.06),0.064),0.06);
    sd = pAdd(sd,dCircle(pos - vec2(-0.006,0.03),0.04),0.01);
    sd = pAdd(sd,dCircle(pos - vec2(0.01,0.07),0.042),0.01);
    sd = pDif(sd,dCircle(pos - vec2(0.12,-0.036),0.1));
    sd = pSmooth(sd,factor);
    return vec4(cPenguinBellyAndEyes(pos),sd);
}

vec4 sPenguinBody2(in vec2 pos,in float factor)
{
    pos.x -= 0.10;
    float sd = dCircle(pos,0.04);
    sd = pAdd(sd,dCircle(pos - vec2(0.0,-0.066),0.062),0.06);
    sd = pAdd(sd,dCircle(pos - vec2(0.05,-0.10),0.016),0.06);
    sd = pAdd(sd,dCircle(pos - vec2(-0.018,-0.11),0.03));
    sd = pAdd(sd,dCircle(pos - vec2(0.01,0.038),0.040),0.01);
    sd = pAdd(sd,dSegment(pos,vec2(0.0,0.02),vec2(-0.1,-0.04),0.026 - ((abs(pos.x)) / 6.0)));
    sd = pAdd(sd,dSegment(pos,vec2(0.02,-0.03),vec2(0.1,0.02),0.026 - ((abs(pos.x)) / 8.0)));
    sd = pAdd(sd,dCircle(pos - vec2(-0.06,-0.1),0.01),0.02);
    sd = pSmooth(sd,factor);
    return vec4(cPenguinBody(pos),sd);
}

vec4 sPenguinLegs2(in vec2 pos,in float factor)
{
    pos.x -= 0.10;
    float sd = dSegment(pos,vec2(0.0,-0.15),vec2(-0.026,-0.14),0.014);
    sd = pSub(sd,dSegment(pos,vec2(-0.016,-0.1),vec2(0.04,-0.2),0.01));
    sd = pAdd(sd,dSegment(pos,vec2(0.06,-0.12),vec2(0.08,-0.12),0.014));
    sd = pSub(sd,dSegment(pos,vec2(0.08,-0.1),vec2(0.1,-0.12),0.01));
    sd = pSmooth(sd,factor);
    return vec4(cPenguinBeakAndFeet(pos),sd);
}

vec3 rDraw(in vec3 color,in vec4 obj)
{
    return mix(color,obj.rgb,obj.a);
}

vec2 rPixel(in vec2 pos,in vec3 resolution)
{
    return vec2((pos - (0.5 * resolution.xy)) / resolution.y);
}

void mainImage(out vec4 pixel_color,in vec2 pixel_pos)
{
    vec2 pixel = rPixel(pixel_pos,iResolution);
    vec3 color = cSky(pixel);
    float factor_terrain = 0.001;
    float factor_penguin = 0.0001;
    color = rDraw(color,sTerrain2(pixel,factor_terrain));
    color = rDraw(color,sTerrain(pixel,factor_terrain));
    color = rDraw(color,sTerrain3(pixel,factor_terrain));
    color = rDraw(color,sPenguinBeakAndLegs(pixel,factor_penguin));    
    color = rDraw(color,sPenguinBody(pixel,factor_penguin));
    color = rDraw(color,sPenguinBellyAndEyes(pixel,factor_penguin));
    color = rDraw(color,sPenguinLegs2(pixel,factor_penguin));
    color = rDraw(color,sPenguinBody2(pixel,factor_penguin));
    color = rDraw(color,sPenguinArmRight(pixel,factor_penguin));
    pixel_color = vec4(color,1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}