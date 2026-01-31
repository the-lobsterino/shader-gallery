#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define PI 3.141593
#define EPS 1e-5

#define MAT_CEBODY 0
#define MAT_CEEYE_WHITE 1
#define MAT_CEEYE_BLACK 2
#define MAT_GROUND 3

vec3 pointed_pos;

mat4 rotMat(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

struct Obj
{
    int index;
    float d;
};

float atan2(in float y, in float x)
{
    return x == 0.0 ? sign(y)*PI/2. : atan(y, x);
}

float sdSphere(vec3 pos, float radius)
{
    return length(pos) - radius;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return length(max(d,0.0))
         + min(max(d.x,max(d.y,d.z)),0.0); // remove this line for an only partially signed sdf 
}

float sdRoundCone( in vec3 p, in float r1, float r2, float h )
{
    vec2 q = vec2( length(p.xz), p.y );
    
    float b = (r1-r2)/h;
    float a = sqrt(1.0-b*b);
    float k = dot(q,vec2(-b,a));
    
    if( k < 0.0 ) return length(q) - r1;
    if( k > a*h ) return length(q-vec2(0.0,h)) - r2;
        
    return dot(q, vec2(a,b) ) - r1;
}

float dot2( in vec2 v ) { return dot(v,v); }

float sdCappedCone( in vec3 p, in float h, in float r1, in float r2 )
{

    vec2 q = vec2( length(p.xz), p.y );
    
    vec2 k1 = vec2(r2,h);
    vec2 k2 = vec2(r2-r1,2.0*h);
    vec2 ca = vec2(q.x-min(q.x,(q.y < 0.0)?r1:r2), abs(q.y)-h);
    vec2 cb = q - k1 + k2*clamp( dot(k1-q,k2)/dot2(k2), 0.0, 1.0 );
    float s = (cb.x < 0.0 && ca.y < 0.0) ? -1.0 : 1.0;
    return s*sqrt( min(dot2(ca),dot2(cb)) );
}

Obj objU(Obj x, Obj y)
{
    if (x.d < y.d)
    {
        return x;
    } else
    {
        return y;
    }
}

float sdGround(vec3 pos)
{
    return pos.y;
}

float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}

float opSmoothIntersection( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) + k*h*(1.0-h);
}

float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h);
}

float sdCeLeg(vec3 pos)
{
    return sdRoundCone(pos, 0.1, 0.20, 0.30);
}

float sdCeBody(vec3 pos)
{
    return sdCappedCone(pos, 0.45, 0.70, 0.40) - 0.25;
}

float sdCeEar(vec3 pos)
{
    float box = sdBox(pos, vec3(1.0, 2.0, 0.05)) - 0.02;
    float rc = sdRoundCone(pos, 0.46, 1.14,1.00 );
    float sp1 = sdSphere(pos-vec3(0, -0.4125, 0), 2.00);
    float sp2 = sdSphere(pos-vec3(1.15, -0.7, 0), 1.0);
    float sp3 = sdSphere(pos-vec3(0, 0.5, 1.99), 2.0);
    float sdf = rc;
    sdf = opSmoothIntersection(sp1, sdf, 0.1);
    sdf = opSmoothIntersection(box, sdf, 0.1);
    sdf = opSmoothSubtraction(sp2, sdf, 0.1);
    sdf = opSmoothSubtraction(sp3, sdf, 0.1);
    return sdf;
}

Obj cerulean(vec3 pos)
{
    float body = 0.;

    mat4 lookat = rotMat(vec3(0, 1., 0), atan2(pointed_pos.x, pointed_pos.z));
    pos = (vec4(pos, 1.0) * inverse(lookat)).xyz;

    // ear
    float earScale = 0.45;
    vec3 earOffset = vec3(-0.5, 1.76, 0.0);
    mat4 earRot = rotMat(vec3(1, 0, 0), radians(-40.));
    earRot = earRot * rotMat(vec3(0, 1, 0), radians(40.));
    vec3 earPos = pos;
    earPos.x = -abs(earPos.x);
    earPos -= earOffset;
    earPos = (vec4(earPos, 1.) * inverse(earRot)).xyz;
    earPos /= earScale;
    body = sdCeEar(earPos) * earScale;

    // body
    body = opSmoothUnion(body, sdCeBody(pos-vec3(0., 1.02, 0.)), 0.1);

    // leg
    body = opSmoothUnion(body, sdCeLeg(pos), 0.1);

    // eye
    float wEye = 0.;
    wEye = sdSphere(pos-vec3(0.0, 1.0, 0.5), 0.5);
    wEye += 0.01*sin(12.0*pos.x-time)*sin(12.0*pos.y-time) * sin(12.0*pos.z+time*2.);

    float bEye = 0.;
    bEye = sdSphere(pos-vec3(0.0, 1.0, 0.75), 0.3);

    Obj obj = Obj(MAT_CEBODY, body);
    obj = objU(obj, Obj(MAT_CEEYE_WHITE, wEye));
    obj = objU(obj, Obj(MAT_CEEYE_BLACK, bEye));

    return obj;
}

Obj SDF(vec3 pos)
{
    Obj obj = cerulean(pos);
    obj = objU(obj, Obj(MAT_GROUND, sdGround(pos)));
    return obj;
}

float SDFd(vec3 pos)
{
    return SDF(pos).d;
}

vec3 calcNormal(vec3 pos)
{
    return normalize(vec3(SDFd(pos + vec3(EPS, 0, 0)) - SDFd(pos + vec3(-EPS, 0, 0)),
        SDFd(pos + vec3(0, EPS, 0)) - SDFd(pos + vec3(0, -EPS, 0)),
        SDFd(pos + vec3(0, 0, EPS)) - SDFd(pos + vec3(0, 0, -EPS))
    ));
}

struct Trace
{
    bool hit;
    vec3 hitPos;
    vec3 hitNormal;
    int steps;
    float d;
    int material;
};

Trace trace(vec3 origin, vec3 dir)
{
    const int maxSteps = 1000;
    Trace tr;
    tr.hit = false;
    tr.hitPos = vec3(0);
    tr.hitNormal = vec3(0);
    tr.steps = 0;
    tr.d = 0.0;
    tr.material = -1;
    float t = 0.001;
    for (int i = 0; i < maxSteps; i++)
    {
        vec3 p = origin + t * dir;
        Obj obj = SDF(p);
        if (abs(obj.d) < EPS)
        {
            tr.hit = true;
            tr.hitPos = p;
            tr.hitNormal = calcNormal(p);
            tr.steps = i;
            tr.d = t;
            tr.material = obj.index;
            break;
        }
        t += obj.d;
    }
    return tr;
}

float softShadow(vec3 hitPos, vec3 hitNormal, vec3 shadowRay, float k, float minV)
{
    vec3 origin = hitPos + 0.001 * hitNormal;
    float ss = 100.0;
    float t = 0.001;
    for (int i = 0; i < 100; i++)
    {
        vec3 p = origin + t * shadowRay;
        float d = SDF(p).d;
        ss = min(ss, k * d / t);
        if (abs(d) < EPS)
        {
            break;
        }
        t += d;
    }
    ss = clamp(ss, minV, 1.0);
    return ss;
}

float detailedAO(vec3 hitPos, vec3 hitNormal, float k)
{
    const int count = 5;
    float ao = 0.0;
    for (int i = 1; i <= count; i++)
    {
        float t = k * float(i) / float(count);
        vec3 p = hitPos + t * hitNormal;
        float w = 1.0/pow(2.0, float(i));
        ao += w * abs(t - SDF(p).d);
    }
    ao = 1.0 - ao;
    return clamp(ao, 0.0, 1.0);
}

void main( void ) {
    vec3 sunLight = vec3(30, 5, 30.0);
    vec3 skyLight = vec3(1, 2, 1.0);

    float r = 15.0;
    float s = 2.*PI*(2. * mouse.x - 1.);
    vec3 camera_pos = vec3(0, mouse.y*15. , 15.0);
    vec3 camera_up = vec3(0.0, 1.0, 0.0);
    vec3 camera_dir = normalize(-camera_pos);
    float screen_dist = 5.0;
    vec3 screen_center = camera_pos + screen_dist * camera_dir;
    vec3 screen_right = normalize(cross(camera_dir, camera_up));
    vec3 screen_up = normalize(cross(screen_right, camera_dir));

    vec2 uv = (2.0 *  gl_FragCoord.xy - resolution.xy) /  resolution.y ;
    vec3 screen_pos = screen_right * uv.x + screen_up * uv.y + screen_center;
    vec3 ray_dir = normalize(screen_pos - camera_pos);

    vec2 mouseUV = 2.*mouse-vec2(1.);
    mouseUV.x *= resolution.x / resolution.y;
    vec3 pointed_ray = (screen_right * mouseUV.x + screen_up * mouseUV.y + screen_center) - camera_pos;
    pointed_pos = camera_pos - camera_pos.y / pointed_ray.y * pointed_ray;

    Trace tr = trace(camera_pos, ray_dir);
    vec4 color = vec4(0.0, 0.0, 0.0, 1);

    if (tr.hit)
    {
        vec3 eye = -ray_dir;
        vec3 N = tr.hitNormal;
        // vec3 L = normalize(sunLight - tr.hitPos);
        vec3 L = normalize(skyLight);
        vec3 R = reflect(-L, N);
        vec3 c = vec3(0);
        if (tr.material == MAT_GROUND)
        {
            vec3 ambient = vec3(0.00, 0.00, 0.03);
            vec3 diffuse = vec3(0.6, 0.8, 0.4);
            c += diffuse * max(dot(L, N),0.);
            c += ambient;
        }
         else if (tr.material == MAT_CEEYE_WHITE)
        {
            vec3 diffuse = vec3(1.0, 1.0, 1.0);
            c = vec3(0.2, 0.2, 0.2);
            c += diffuse * max(dot(L, N),0.);
        }
         else if (tr.material == MAT_CEEYE_BLACK)
        {
            c = vec3(0.0);
        }
        else if (tr.material == MAT_CEBODY)
        {
            vec3 diffuse = vec3(0.1, 0.6, 0.9);
            vec3 ambient = vec3(0.2, 0.2, 0.23);
            c += diffuse * max(dot(L, N),0.);
            c += ambient;
            c = clamp(c, 0.,1.);
        }
        c *= softShadow(tr.hitPos, tr.hitNormal, L, 8.0, 0.8);
        c *= detailedAO(tr.hitPos, tr.hitNormal, 1.0);
        color = vec4(c, 1.0); 
    }

    gl_FragColor = color;
}