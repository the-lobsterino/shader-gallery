/*
 * Original shader from: https://www.shadertoy.com/view/wdGSD1
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
#define S(a,b,t) smoothstep(a,b,t)

vec4 Grid(vec2 point, float num)
{
    vec2 r = vec2(1, 1.732);
    vec2 h = r*.5;
    vec2 uv = point*num;
    
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv-h, r) - h;
    
    uv = length(a)<length(b)? a:b;
    vec2 id = floor(point*num);
    
    return vec4(uv, id); 
}

float Hex(vec2 uv)
{
    uv=abs(uv);
    float c = dot(uv, normalize(vec2(1, 1.732))); 
    c=max(c, uv.x);
    float d = atan(uv.x, uv.y);
    
    return c;
}

vec2 Polar(vec2 uv)
{
    return vec2 (length(uv), atan(uv.x, uv.y)+3.1415);
}

float N21(vec2 p)
{
    p=fract(p*vec2(233.34, 851.73));
    p+=dot(p,p+23.45);
    return fract(p.x*p.y);
}

vec2 N22(vec2 p)
{
    float n=N21(p);
    return vec2(n, N21(p+n));
}

vec2 GetPos(vec2 id, vec2 offs)
{
    vec2 n =N22(id+offs)*iTime;

    return offs+sin(n)*.4;
}

float DistLine(vec2 p, vec2 a, vec2 b)
{
    vec2 pa = p-a;
    vec2 ba = b-a;
    float t=clamp(dot(pa,ba)/dot(ba,ba), 0., 1.);
    return length(pa-ba*t);
}

float Line(vec2 p, vec2 a, vec2 b)
{
    float d = DistLine(p,a,b);
    float f = 1.-min(length(p-a), length(p-b));
    float m= S(f*2., .2, d*20.);
    m *=S(1.2, .8, length(a-b));
    m *= f*f*f;
    return m;
}

float Layer(vec2 uv)
{
    float m=0.;

    return m;
}

vec3 Universe(vec2 uv, float m)
{
    if (m>0.) return vec3(0);
    float t = iTime*.1;
    mat2 rot = mat2(cos(t), -sin(t), sin(t), cos(t));
    uv *=rot;
    
    for(float i=0.; i<1.; i+= 1./4.)
    {
        float z = fract(i+t);
        float size = mix(10., .5, z);
        float fade = S(0., .5, z) * S(1., .8, z);
            
        m+=Layer(uv*size+i*20.)*fade;
    }
    
    vec3 base = sin(t*vec3(.3, .5, .7))*.2 +.6;
    return vec3(m*base);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.y;
    //uv += iTime/10.;
	vec4 coord = Grid(uv, 20.);
    vec2 st = coord.xy;
    
    // c= hex radius
    float r = length(Hex(st));
    float index = ((coord.w*3.) + (coord.z*3.))*.06;
    float d = length(fragCoord - iResolution.xy/2.)/iResolution.y;
    float r1 = smoothstep(.3+sin(iTime+d*3.)*.1,.4+sin(iTime+d*3.)*.1732 ,r);
    float r2 = smoothstep(.27+sin(iTime+d*3.)*.1,.37+sin(iTime+d*3.)*.15 ,r);
    
    vec3 col = vec3(.0, .3, .4+(sin(iTime*.3+d)*.2))*(.5-r)*step(r1, .5);
    if (r>r1 && r<r2) col+=vec3(.2);
    
    col +=Universe(uv, col.b);    
    // Output to screen
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}