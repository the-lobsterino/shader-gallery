// https://www.shadertoy.com/view/Xs3yWN
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define EULER 2.7182818
#define IEULER 0.367879
float wave(vec2 uv, vec2 emitter, float speed, float phase, float timeshift)
{
	float dst = distance(uv, emitter);
    float _time = time*0.1;
	return pow(EULER, sin(dst * phase - (_time + timeshift) * speed));
}
vec2 wavedrag(vec2 uv, vec2 emitter)
{
	return normalize(uv - emitter);
}
float pModMirror1(inout float p, float size)
{
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize,size) - halfsize;
	p *= mod(c, 2.0)*2.0 - 1.0;
	return c;
}

float getwaves(vec2 position,float mirrorX,float mirrorY)
{
    float iter = 0.0;
    float phase = 6.0;
    float speed = 2.0;
    float weight = 1.2;
    float w = 0.0;
    float ws = 0.0;
    float iwaterspeed = 1.0;
    
    pModMirror1(position.x,mirrorX);
    pModMirror1(position.y,mirrorY);
    for(int i=0;i<20;i++)										// crank this for more veins
    {
        vec2 p = vec2(sin(iter), cos(iter)) * 300.0;
        float res = wave(position, p, speed, phase, 0.0) * IEULER;
        float res2 = wave(position, p, speed, phase, 0.006) * IEULER;
        position -= wavedrag(position, p) * (res - res2) * weight * 5.0 * iwaterspeed;
        w += res * weight;
        iter += 12.0;
        ws += weight;
        weight = mix(weight, 0.0, 0.12);
        phase *= 1.2;
        speed = pow(speed, 1.014);
    }
    return w / ws;
}



vec3 tunnel(vec2 p)
{
    float iTime = time;
    float _d = length(p);
    p.x += sin(p.x);
    float wibble = 1.0-(0.1+sin(iTime+_d*_d*15.0)*0.1);
    p.x *= wibble;
    float offx = 0.1+sin(iTime*0.5)*0.05;
    float offy = 0.1+cos(iTime*0.5)*0.1;
    p.x += offx;
    p.y += 0.1-offy;
    
    float a = atan(p.y,p.x);
    float r = length(p);
    vec2 uv = vec2( 0.13/r + 0.125*iTime, a/3.1415927 );
    float w = getwaves(uv,128.0,1.0);
    vec3 col = vec3( 1.0 - w*vec3(.88-w*.15,1.6,1.8)*1.0 );
    col = clamp(col,0.0,1.0);
    r = smoothstep(0.0,0.064,r);
    col = mix(vec3(0.55,0.1,0.05),col,r*r);
    return col;
}



void main()
{
    vec2 uv = ( gl_FragCoord.xy - 0.5* resolution.xy ) / resolution.y;
    vec3 col = tunnel(uv*0.4);
    float rf = sqrt(dot(uv, uv)) * 0.666;
    float rf2_1 = rf * rf + 1.0;
    col *= 1.0 / (rf2_1 * rf2_1);
    gl_FragColor = vec4(col.xyz,1.0);
}

