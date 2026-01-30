precision mediump float;

uniform float time;
uniform vec2  resolution;

const float PI = 3.1415926;
const vec3 faceColor = vec3(0.95, 0.75, 0.5);
const vec3 noseColor = vec3(0.95, 0.25, 0.25);
const vec3 cheekColor = vec3(1.0, 0.55, 0.25);
const vec3 eyesColor = vec3(0.15, 0.05, 0.05);
const vec3 highlight = vec3(0.95, 0.95, 0.95);
const vec3 lineColor = vec3(0.3, 0.2, 0.2);

const float sphereSize = 1.0;

struct Its {vec3 color;};

float rand(int seed, float ray) {
    return mod(sin(float(seed)*363.5346+ray*674.2454)*6743.4365, 1.0);
}

void sunrise2(vec2 p, inout vec3 i){
    float pi = 3.14159265359;
    vec2 position = p;
    position.y *= resolution.y/resolution.x;
    float ang = atan(position.y, position.x);
    float dist = length(position);
    //i = vec3(0.4, 0.95, 1.15) * (pow(dist, -1.0) * 0.04);
    i = vec3(0.4*2.0, 0.95/2.0, 1.15/2.0) * (pow(dist, -1.0) * 0.04);
    for (float ray = 0.0; ray < 10.0; ray += 0.095) {
        //float rayang = rand(5234, ray)*6.2+time*5.0*(rand(2534, ray)-rand(3545, ray));
        float rayang = rand(5, ray)*6.2+(time*0.05)*20.0*(rand(2546, ray)-rand(5785, ray))-(rand(3545, ray)-rand(5467, ray));
        rayang = mod(rayang, pi*2.0);
        if (rayang < ang - pi) {rayang += pi*2.0;}
        if (rayang > ang + pi) {rayang -= pi*2.0;}
        float brite = .5 - abs(ang - rayang);
        brite -= dist * 0.2;
        if (brite > 0.0) {
            i += vec3(0.7+0.4*rand(8644, ray), 0.3+0.4*rand(4567, ray), 0.4*rand(7354, ray)) * brite * 0.1;
        }
    }
}

float distFunc(vec3 p){
    return length(p) - sphereSize;
}

float sdSphere( vec3 p, float s, vec3 color, inout Its its )
{
    float l = length(p)-s;
    if(l < s/10.0){
        its.color = color;
    }
    return l;
}

float opU( float d1, float d2 )
{
    return min(d1,d2);
}

vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        distFunc(p + vec3(  d, 0.0, 0.0)) - distFunc(p + vec3( -d, 0.0, 0.0)),
        distFunc(p + vec3(0.0,   d, 0.0)) - distFunc(p + vec3(0.0,  -d, 0.0)),
        distFunc(p + vec3(0.0, 0.0,   d)) - distFunc(p + vec3(0.0, 0.0,  -d))
    ));
}

void main(void){
    Its its;
    its.color = vec3(1.0);

    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float x = sin(time*2.0) * 0.5;
    float y = 0.0;
    float z = cos(time*2.0) * 0.5 + 3.0;

    vec3 cPos = vec3(x, y, z);
    vec3 cDir = vec3(0.0, 0.0, -1.0);
    vec3 cUp  = vec3(0.0, 1.0, 0.0);
    vec3 lightDir = vec3(-0.57, 0.57, 0.57);
    vec3 cSide = cross(cDir, cUp);
    float targetDepth = 1.0;
    
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
    
    float distance = 0.0;
    float distLen = 0.0;
    vec3  distPos = cPos;
    for(int i = 0; i < 32; i++){
        distance = sdSphere(distPos + vec3( 0.0,  0.0, 0.0), 1.0, faceColor, its);
        distance = opU(distance, sdSphere(distPos + vec3( 0.2,-0.3, -1.0), 0.1, eyesColor, its));
        distance = opU(distance, sdSphere(distPos + vec3(-0.2,-0.3, -1.0), 0.1, eyesColor, its));
        distance = opU(distance, sdSphere(distPos + vec3( 0.5, 0.0, -1.0), 0.2, cheekColor, its));
        distance = opU(distance, sdSphere(distPos + vec3( 0.0, 0.0, -1.0), 0.2, noseColor, its));
        distance = opU(distance, sdSphere(distPos + vec3(-0.5, 0.0, -1.0), 0.2, cheekColor, its));
        distLen += distance;
        distPos = cPos + distLen * ray;
    }
    

    vec3 normal = getNormal(distPos);

    if(abs(distance) < 0.001){
        //gl_FragColor = vec4(normal, 1.0);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        //vec3 color = vec3(1.0, 1.0, 1.0) * diff;
        vec3 color = its.color * diff;
        gl_FragColor = vec4(color, 1.0);
    }else{
	vec3 color = vec3(0.0, 0.0, 0.0);
        sunrise2(p, color);
        gl_FragColor = vec4(color, 1.0);
    }
}
