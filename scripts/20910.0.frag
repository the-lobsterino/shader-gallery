#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.1415926;
const vec3 lightColor = vec3(0.95, 0.95, 0.5);
const vec3 backColor = vec3(0.95, 0.25, 0.25);
const vec3 faceColor = vec3(0.95, 0.75, 0.5);
const vec3 noseColor = vec3(0.95, 0.25, 0.25);
const vec3 cheekColor = vec3(1.0, 0.55, 0.25);
const vec3 eyesColor = vec3(0.15, 0.05, 0.05);
const vec3 highlight = vec3(0.95, 0.95, 0.95);
const vec3 lineColor = vec3(0.3, 0.2, 0.2);

float rand(int seed, float ray) {
    return mod(sin(float(seed)*363.5346+ray*674.2454)*6743.4365, 1.0);
}

void circle(vec2 p, vec2 offset, float size, vec3 color, inout vec3 i){
    float l = length(p - offset);
    if(l < size){
        i = color;
    }
}

void ellipse(vec2 p, vec2 offset, vec2 prop, float size, vec3 color, inout vec3 i){
    vec2 q = (p - offset) / prop;
    if(length(q) < size){
        i = color;
    }
}

void circleLine(vec2 p, vec2 offset, float iSize, float oSize, vec3 color, inout vec3 i){
    vec2 q = p - offset;
    float l = length(q);
    if(l > iSize && l < oSize){
        i = color;
    }
}

void arcLine(vec2 p, vec2 offset, float iSize, float oSize, float rad, float height, vec3 color, inout vec3 i){
    float s = sin(rad);
    float c = cos(rad);
    vec2 q = (p - offset) * mat2(c, -s, s, c);
    float l = length(q);
    if(l > iSize && l < oSize && q.y > height){
        i = color;
    }
}

void rect(vec2 p, vec2 offset, float size, vec3 color, inout vec3 i){
    vec2 q = (p - offset) / size;
    if(abs(q.x) < 1.0 && abs(q.y) < 1.0){
        i = color;
    }
}

void sunrise(vec2 p, inout vec3 i){
    float f = atan(p.y, p.x) + time;
    float fs = sin(f * 10.0);
    i = mix(lightColor, backColor, fs);
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

void decoration(vec2 p, inout vec3 i){
    vec2 q = mod(p, 0.2) - 0.1;
    float s = sin(time);
    float c = cos(time);
    q *= mat2(c, s, -s, c);
    float v = 0.1 / abs(q.y) * abs(q.x);
    float r = v * abs(sin(time * 6.0) + 1.5);
    float g = v * abs(sin(time * 4.5) + 1.5);
    float b = v * abs(sin(time * 3.0) + 1.5);
    i = vec3(r, g, b);
}

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 destColor = vec3(1.0);

    //sunrise(p, destColor);
    sunrise2(p, destColor);
    //decoration(p, destColor);
    
    float s = sin(sin(time * 2.0) * 0.75);
    float c = cos(sin(time * 2.0));
    vec2 q = p * mat2(c, -s, s, c);

    circle(q, vec2(0.0), 0.5, faceColor, destColor);
    circle(q, vec2(0.0, -0.05), 0.15, noseColor, destColor);
    circle(q, vec2(0.325, -0.05), 0.15, cheekColor, destColor);
    circle(q, vec2(-0.325, -0.05), 0.15, cheekColor, destColor);
    ellipse(q, vec2(0.15, 0.135), vec2(0.75, 1.0), 0.075, eyesColor, destColor);
    ellipse(q, vec2(-0.15, 0.135), vec2(0.75, 1.0), 0.075, eyesColor, destColor);
    circleLine(q, vec2(0.0), 0.5, 0.525, lineColor, destColor);
    circleLine(q, vec2(0.0, -0.05), 0.15, 0.17, lineColor, destColor);
    arcLine(q, vec2(0.325, -0.05), 0.15, 0.17, PI * 1.5, 0.0, lineColor, destColor);
    arcLine(q, vec2(-0.325, -0.05), 0.15, 0.17, PI * 0.5, 0.0, lineColor, destColor);
    arcLine(q * vec2(1.2, 1.0), vec2(0.19, 0.2), 0.125, 0.145, 0.0, 0.02, lineColor, destColor);
    arcLine(q * vec2(1.2, 1.0), vec2(-0.19, 0.2), 0.125, 0.145, 0.0, 0.02, lineColor, destColor);
    arcLine(q * vec2(0.9, 1.0), vec2(0.0, -0.15), 0.2, 0.22, PI, 0.055, lineColor, destColor);
    rect(q, vec2(-0.025, 0.0), 0.035, highlight, destColor);
    rect(q, vec2(-0.35, 0.0), 0.035, highlight, destColor);
    rect(q, vec2(0.3, 0.0), 0.035, highlight, destColor);

    gl_FragColor = vec4(destColor, 1.0);
}
