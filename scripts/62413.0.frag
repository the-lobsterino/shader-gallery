// - glslfan.com --------------------------------------------------------------
// Ctrl + s or Command + s: compile shader
// Ctrl + m or Command + m: toggle visibility for codepane
// ----------------------------------------------------------------------------
precision mediump float;
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene

#define STEPS (64)
#define EPS (0.0001)

mat2 rot(float a)
{
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdSphere(vec3 p, float r)
{ 
    return length(p)-r; 
}
float sdBox(vec3 p, vec3 b)
{ 
    return length(max(abs(p)-b,.0));
}
float sdTorus(vec3 p, vec2 t)
{
    vec2 q = vec2(length(p.xz)-t.x,p.y);
    return length(q)-t.y;
}
float sdCappedCone(vec3 p, float h, float r1, float r2 )
{
    vec2 q = vec2( length(p.xz), p.y );
    
    vec2 k1 = vec2(r2,h);
    vec2 k2 = vec2(r2-r1,2.0*h);
    vec2 ca = vec2(q.x-min(q.x, mix(r1,r2,step(.0 ,q.y))), abs(q.y)-h);
    vec2 cb = q - k1 + k2*clamp( dot(k1-q,k2)/dot(k2,k2), 0.0, 1.0 );
    float s = (cb.x < 0.0 && ca.y < 0.0) ? -1.0 : 1.0;
    return s*sqrt( min(dot(ca,ca),dot(cb,cb)) );
}

float map(vec3 p)
{
    float d = sdSphere(p - vec3(.0, .0, 5.0), .5);
    //d = min(d, sdSphere(p - vec3(.0, .7, 5.0), .3));
    
    vec3 c = p - vec3(.0, .7, 5.0);
    d = min(d, sdCappedCone(c, .2, .2, .4));

    vec3 tr = p - vec3(.0,.0,5.0);
    tr.yz *= rot(time*1.0);
    //tr.yx *= rot(time*3.0);
    d = min(d, sdTorus(tr, vec2(1.2,.2)));
    
    vec3 box = p - vec3(.0,-.7,5.0);
    box.yz *= rot(time*.5);
    box.xy *= rot(time*.75);
    d = min(d, sdBox(box, vec3(.2,.2,.2)));
    return d;
}

// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 normal(vec3 p)
{
    const vec2 h = vec2(EPS,0);
    return normalize(vec3(map(p+h.xyy) - map(p-h.xyy),
                          map(p+h.yxy) - map(p-h.yxy),
                          map(p+h.yyx) - map(p-h.yyx)));
}

#define TOONSTEP (4.0)
float toon(vec3 n, vec3 l)
{
    float ld = max(dot(n, normalize(l)),.0)*.3+.7;
    return floor(ld*ld*TOONSTEP)/TOONSTEP;
}

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    vec3 rd = normalize(vec3(p, 3.5));
    vec3 ldir = vec3(.0,.0,-3.5);
    vec3 amb = 0.6*vec3(1,0,1);

    float t = 0.0;
    vec3 col = vec3(1.0);
    for (int i = 0; i < STEPS; i++) {
        vec3 rp = rd * t;
        float d = map(rp);
        if (d < EPS) {
            ldir.xy = vec2(sin(time)*2.0, cos(time*.5)*2.0);
            col = vec3(toon(normal(rp), ldir)) + amb;
            break;
        }
        t += d;
    }
    gl_FragColor = vec4(col, 1.0);
}

