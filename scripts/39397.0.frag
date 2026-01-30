precision mediump float;
uniform vec2  resolution;
uniform vec2  mouse;
uniform float time;
uniform sampler2D prevScene;

float sdHeart(vec3 p)
{
    mat3 m_x = mat3(1,0,0,0,cos(1.57),-sin(1.57),0,sin(1.57),cos(1.57));
    p = m_x * p;
    mat3 m_z = mat3(cos(time),-sin(time),0,sin(time),cos(time),0,0,0,1);
    p = m_z * p;
    return sqrt(p.x*p.x+2.25*p.y*p.y+p.z*p.z+pow(p.x*p.x+0.1125*p.y*p.y, 0.33)*p.z)-1.0;
}

float distanceHub(vec3 p){
    return sdHeart(p);
}

vec3 genNormal(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        distanceHub(p + vec3(  d, 0.0, 0.0)) - distanceHub(p + vec3( -d, 0.0, 0.0)),
        distanceHub(p + vec3(0.0,   d, 0.0)) - distanceHub(p + vec3(0.0,  -d, 0.0)),
        distanceHub(p + vec3(0.0, 0.0,   d)) - distanceHub(p + vec3(0.0, 0.0,  -d))
    ));
}

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 cPos = vec3(0.0,  0.0,  2.5);
    vec3 cDir = vec3(0.0,  0.0, -1.0);
    vec3 cUp  = vec3(0.0,  1.0,  0.0);
    vec3 cSide = cross(cDir, cUp);
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
    if(abs(dist) < 0.001){
        vec3 normal = genNormal(rPos);
        vec3 light = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(normal, light), 0.1);
        gl_FragColor = vec4(vec3(diff*240.0/255.0, diff*128.0/255.0, diff*128.0/255.0), 1.0);
    }else{
        gl_FragColor = vec4(vec3(0.0, 0.0, 0.0), 1.0);
    }
}
