#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.);
const float angle = 60.;
const float fov = angle * .5 * PI / 180.;

const vec3 lightDir = vec3(-.577, .577, .577);

vec3 trans(vec3 p){
    return mod(p, 4.) - 2.;
}

float cube(vec3 p){
    return length(max(abs(p) - vec3(0.1, .1, .5), 0.));
}

vec3 getNormal(vec3 p){
    float d = .0001;
    return normalize(vec3(cube(p + vec3(d, 0., 0.)) - cube(p + vec3(-d, 0., 0.)),
                  cube(p + vec3(0., d, 0.)) - cube(p + vec3(0., -d, 0.)),
                  cube(p + vec3(0., 0., d)) - cube(p + vec3(0., 0., -d))
             ));
}

mat2 rot(float a){
    float c = cos(a);
    float s = sin(a);
    
    return mat2(c, s, -s, c);
}

void main( void ) {

    vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    
    vec3 cPos = vec3(0., 0., 3.);
    cPos.y = 3. * sin(time * 2.);
    cPos.z += 20. * time;
    vec3 cTar = vec3(0.);
    vec3 cDir = normalize(vec3(cTar - cPos));
    vec3 cUp  = vec3(0., 1., 0.);
    vec3 cSide = cross(cDir, cUp);
    float targetDir = .5 ;
    
    //vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDir);
    float depth = 0.;
    vec3 destColor = vec3(0.);
    
    float ac = 0.;
    for(int i=0; i<16; i++){
        vec3 rayPos = cPos + normalize(ray) * depth;
        float t = cube(trans(rayPos));
        if(abs(t) < .001){
            vec3 normal = getNormal(rayPos);
            float diff = clamp(dot(lightDir, normal), .1, 1.);
            diff *= max(abs(diff), .02);
            ac += exp(-diff * 3.);
            destColor = vec3(2.8, 0.6,  1.) * ac * diff;
        }
        depth += t;
    }
    
    gl_FragColor = vec4(destColor, 1.);
}