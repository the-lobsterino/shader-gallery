#ifdef GL_ES
precision mediump float;
#endif

const int MAX_MARCHING_STEP = 255;
const float MAX_DIST = 100.;
const float MIN_DIST = 0.;
const float EPSILON = 0.001;
float dot2( in vec2 v ) { return dot(v,v); }
float dot2( in vec3 v ) { return dot(v,v); }
float ndot( in vec2 a, in vec2 b ) { return a.x*b.x - a.y*b.y; }

uniform vec2 u_resolution;
uniform vec3 iResolution;
uniform float u_time;

struct Surface {
    float distance;
    vec3 color;
};


float smin( float a, float b, float k )
{
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*k*(1.0/4.0);
}

float smax(float a,float b,float k) {
    float h = max( k-abs(a-b), 0.0 )/k;
    return max(a,b) + h*h*k*(1./4.);
}

mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
    vec3(1.,0.,0.),
      vec3(0,c,-s),
      vec3(0,s,c));
}

mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
                vec3(c,0,s),
                vec3(0.,1.,0.),
                vec3(-s,0,c));
}

mat3 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
            vec3(c,-s,0),
            vec3(s,c,0),
            vec3(0.,0.,1.)
    );
}

mat3 indentity() {
    return mat3(
        vec3(1.,0.,0.),
        vec3(0.,1.,0.),
        vec3(0.,0.,1.)
    );
}

float sdCircle(vec3 p,float r,vec3 offset) {
    return length(p-offset) - r;
}

float sdCircle(vec3 p,float r,vec3 offset,mat3 transform) {
    p = (p-offset) * transform;
    return length(p) - r;
}

float opCircleSymXZ(vec3 p,float r,vec3 offset) {
    p.xz = abs(p.xz);
    return sdCircle(p,r,offset);
}

float opCircleSymXZ(vec3 p,float r,vec3 offset,mat3 transform) {
    p.xz = abs(p.xz);
    return sdCircle(p,r,offset,transform);
}

float sdRoundedCylinder( vec3 p,vec3 offset, float ra, float rb, float h )
{
    p -= offset;
    vec2 d = vec2( length(p.xz)-2.0*ra+rb, abs(p.y) - h );
    return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}

Surface sdCircle(vec3 p,float r,vec3 offset,vec3 col) {
    float d = length(p - offset) - r;
    return Surface(d,col);
}


Surface opUnion(Surface obj1,Surface obj2) {
   if(obj1.distance < obj2.distance) return obj1; 
   return obj2;
}

float opSmoothUnion(float d1,float d2,float k) {
    float h = clamp( 0.5 + 0.5*(d2 - d1)/k, 0.0, 1.0 );
    return mix(d2,d1,h) - k * h * (1.- h);
}

Surface opSmoothUnion(Surface obj1,Surface obj2,float k) {
    Surface s;
    float h = clamp( 0.5 + 0.5*(obj2.distance-obj1.distance)/k, 0.0, 1.0 );
    s.distance = mix(obj2.distance,obj1.distance,h) - k*h*(1.-h);
    s.color = mix(obj2.color,obj1.color,h) - k*h*(1.-h);
    return s;
}


Surface opIntersect(Surface s1,Surface s2) {
    if(s1.distance > s2.distance) return s1;
    return s2;
}

float opSmoothIntersect(float d1,float d2,float k) {
    float h = clamp(.5 + .5*(d2 - d1)/k,0.,1.);
    return mix(d2,d1,k) + k * h * (1. -h);
}

Surface opSmoothIntersect(Surface s1,Surface s2,float k) {
    Surface s;
    float h = clamp(.5 + .5*(s2.distance - s1.distance)/k,0.,1.);
    s.distance = mix(s2.distance, s1.distance,h) + k * h * (1.-h);
    s.color = mix(s2.color,s1.color,h);
    return s;
}

Surface opSubtract(Surface s1,Surface s2) {
    s1.distance = -s1.distance;
    return opIntersect(s1,s2);
}

Surface sdShape(vec3 p) {
    Surface C1 = sdCircle(p,1.,vec3(-.75,0.,0.),vec3(0.7804, 0.9098, 0.4039));
    Surface C2 = sdCircle(p,1.,vec3(.75,0.,0.),vec3(0.9451, 0.9255, 0.6627));
    return opSubtract(C1,C2);
}

float sdfShape(vec3 p) {
    // p *= rotateY(u_time);
    float d1 = sdRoundedCylinder(p,vec3(0),1.05,.42,.5);
    float d3 = sdRoundedCylinder(p,vec3(0,-.5,0),1.,.5,.5);
    float d2 = opCircleSymXZ(p,1.,vec3(1.2,-.95,1.2));
    return min(smax(-d2,d1,.56),d3); 
}


float frayMarch(vec3 ro,vec3 rd) {
    float depth = MIN_DIST;
    for(int i =0;i < MAX_MARCHING_STEP;++i) {
        vec3 p = ro + depth * rd;
        float dist = sdfShape(p);
        if(dist < EPSILON || dist >= MAX_DIST) return depth;
        depth += dist;
    }
    return -1.;
}

Surface rayMarch(vec3 ro,vec3 rd) {
    float depth = MIN_DIST;
    for(int i = 0;i < MAX_MARCHING_STEP;++i) {
        vec3 d = ro + depth * rd;
        Surface shape = sdShape(d);
        float dist = shape.distance;
        if(dist < EPSILON || depth >= MAX_DIST) 
            return Surface(depth,shape.color);
        depth += dist; 
    }
    return Surface(-1.,vec3(0));
}

vec3 calNormal(vec3 uv) {
    vec3 ans = normalize(vec3(
        sdShape(vec3(uv.x+EPSILON,uv.yz)).distance - sdShape(vec3(uv.x - EPSILON,uv.yz)).distance,
        sdShape(vec3(uv.x,uv.y+EPSILON,uv.z)).distance - sdShape(vec3(uv.x,uv.y - EPSILON,uv.z)).distance,
        sdShape(vec3(uv.xy,uv.z + EPSILON)).distance - sdShape(vec3(uv.xy,uv.z - EPSILON)).distance
    )
    );
    return ans; 
}

vec3 fcalNormal(vec3 uv) {
    vec3 ans = normalize(vec3(
        sdfShape(vec3(uv.x+EPSILON,uv.yz)) - sdfShape(vec3(uv.x - EPSILON,uv.yz)),
        sdfShape(vec3(uv.x,uv.y+EPSILON,uv.z)) - sdfShape(vec3(uv.x,uv.y - EPSILON,uv.z)),
        sdfShape(vec3(uv.xy,uv.z + EPSILON)) - sdfShape(vec3(uv.xy,uv.z - EPSILON))
    )
    );
    return ans; 
}
void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution * 2. - 1.;
    uv.x *= u_resolution.x/u_resolution.y;
    vec3 ro = vec3(0.,0.,5.); // ray origin (camera position)
    vec3 rd = normalize(vec3(uv,-1)); //ray direction 
    vec3 col;
    vec3 backgroundColor = vec3(0.08, 0.08, 0.07);
    Surface co = rayMarch(ro,rd);
    float d = frayMarch(ro,rd);
    if(d > MAX_DIST - EPSILON) 
        col = backgroundColor; 
    else {
        vec3 point = ro + d * rd;

        //Lambert's lighting
        vec3 normal = fcalNormal(point);
        vec3 lightSource = vec3 (0.,2.,5.);
        vec3 lightDir = normalize(lightSource - point);
        float diff = dot(normal,lightDir);
        diff = clamp(diff,0.25,.75);

        col = diff*vec3(1,.5,.2) + .2 * backgroundColor;
    }
    gl_FragColor = vec4(col,1);
}