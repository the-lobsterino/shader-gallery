precision mediump float;
uniform vec2  resolution;
uniform vec2  mouse;
uniform float time;
uniform sampler2D prevScene;
float dSphere(vec3 p, float r){
    return sqrt(p.x*p.x+p.y*p.y+p.z*p.z) - r;
}
float cdSphere(vec3 p){
    return sqrt(p.x*p.x+p.y*p.y+p.z*p.z) - 0.8;
}
float pdSphere(vec3 p){
    return dSphere(p, 0.7);
}
float dpondeRing(vec3 p){
    mat3 m_z = mat3(cos(time), -sin(time), 0, sin(time), cos(time), 0 ,0,0,1);
    mat3 m_y = mat3(cos(time), 0, -sin(time), 0,1,0, sin(time),0 ,cos(time));
    mat3 m_x = mat3(1,0,0,0,cos(time), -sin(time), 0, sin(time),cos(time));
    p = m_y* m_z * p;
    p = vec3(p.x, p.y+1.5, p.z);
    vec3 p1 = vec3(p.x+1.0, p.y-0.4, p.z);
    vec3 p2 = vec3(p.x+1.5, p.y-1.5, p.z);
    vec3 p3 = vec3(p.x+1.0, p.y-2.6, p.z);
    vec3 p0 = vec3(p.x, p.y-3.0, p.z);
    vec3 p4 = vec3(p.x-1.0, p.y-0.4, p.z);
    vec3 p5 = vec3(p.x-1.5, p.y-1.5, p.z);
    vec3 p6 = vec3(p.x-1.0, p.y-2.6, p.z);
    return min(pdSphere(p6), min(pdSphere(p5), min(pdSphere(p4), min(pdSphere(p3), min(pdSphere(p2), min(pdSphere(p1), min(pdSphere(p0), pdSphere(p))))))));
}
float dTorus(vec3 p){
    mat3 m_z = mat3(cos(time), -sin(time), 0, sin(time), cos(time), 0 ,0,0,1);
    mat3 m_y = mat3(cos(time), 0, -sin(time), 0,1,0, sin(time),0 ,cos(time));
    mat3 m_x = mat3(1,0,0,0,cos(time), -sin(time), 0, sin(time),cos(time));
    p = m_y* m_z * p;
    float r = 0.3;
    float R = 1.0;
    return sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y) ) - r;
}
float distanceHub(vec3 p){
    return min(cdSphere(p), dpondeRing(p));
}
vec3 genNormal(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        distanceHub(p + vec3(  d, 0.0, 0.0)) - distanceHub(p + vec3( -d, 0.0, 0.0)),
        distanceHub(p + vec3(0.0,   d, 0.0)) - distanceHub(p + vec3(0.0,  -d, 0.0)),
        distanceHub(p + vec3(0.0, 0.0,   d)) - distanceHub(p + vec3(0.0, 0.0,  -d))
    ));
}
vec3 doColor(vec3 p){
    float e = 0.001;
    if (cdSphere(p)<e){
        vec3 normal  = genNormal(p);
        vec3 light   = normalize(vec3(1.0, 1.0, 1.0));
        float diff   = max(dot(normal, light), 0.1);
        return vec3(diff, diff, 0.0);
    }
    if (dpondeRing(p)<e){
        vec3 normal  = genNormal(p);
        vec3 light   = normalize(vec3(1.0, 1.0, 1.0));
        float diff   = max(dot(normal, light), 0.1);
        return vec3(diff*177.0/255.0, diff*120.0/255.0, diff*68.0/255.0);
    }
    return vec3(0.0);
}
void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 cPos         = vec3(0.0,  0.0,  3.0); 
    vec3 cDir         = vec3(0.0,  0.0, -1.0); 
    vec3 cUp          = vec3(0.0,  1.0,  0.0); 
    vec3 cSide        = cross(cDir, cUp);      
    float targetDepth = 1.0;                   
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
    float dist = 0.0;  
    float rLen = 0.0;  
    vec3  rPos = cPos; 
    for(int i = 0; i < 32; ++i){
        dist = distanceHub(rPos);
        rLen += dist;
        rPos = cPos + ray * rLen;
    }
    vec3 color = doColor(rPos);
    gl_FragColor = vec4(color, 1.0);
}
