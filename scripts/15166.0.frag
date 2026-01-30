#ifdef GL_ES
precision mediump float;
#endif

// forked from http://www.demoscene.jp/?p=1437

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
const float eps = 0.001;
 
float scene(vec3 pos)
{
    float plane = dot(pos, vec3(0.0, 1.0, 0.0)) + 0.5;
 
    pos.xz = mod(pos.xz, 2.0) - vec2(1.0, 1.0);
    float box = length(max(abs(pos) - vec3(0.5, 0.5, 0.5), 0.0)) - 0.05;
    return min(plane, box);
}
 
vec3 get_normal(vec3 p)
{
    const float d = 0.0001;
    return normalize(vec3(
        scene(p+vec3(d,0.0,0.0))-scene(p+vec3(-d,0.0,0.0)),
        scene(p+vec3(0.0,d,0.0))-scene(p+vec3(0.0,-d,0.0)),
        scene(p+vec3(0.0,0.0,d))-scene(p+vec3(0.0,0.0,-d))
    ));
}
 
void main() {
    vec2 pos =(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y);
 
    vec3 camPos = vec3(0.0, 2.0, 5.0);
    vec3 camDir = vec3(0.0, 0.0, -1.0);
    vec3 camUp = vec3(0.0, 1.0, 0.0);
    vec3 camSide = cross(camDir, camUp);
    float focus = 1.8;
 
    vec3 rayDirection = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);
    float distance;
    vec3 currentCamPos = camPos;
 
    for(int i = 0; i < 128; ++i) {
        distance = scene(currentCamPos);
        currentCamPos += rayDirection * scene(currentCamPos) * 0.95;
    }
 
    vec3 normal = get_normal(currentCamPos);
    if(abs(distance) < eps) {
        float c = dot(normalize(vec3(1.0, 1.0, 1.0)), normal) + length(currentCamPos - camPos) * 0.01;
        gl_FragColor = vec4(c, c, c, 1.0);
    } else {
        gl_FragColor = vec4(1.0);
    }
}