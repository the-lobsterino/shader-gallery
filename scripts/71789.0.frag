precision mediump float;
uniform float time;
uniform float colorBlue;
uniform float colorRed;
uniform float colorYellow;
uniform vec2 resolution;
varying vec2 vUv;
float circle = 0.45;

float getPos(vec2 vPos, float fColorType, float fColor, float fTime) {
    return fColorType / abs(length(vPos) - 5.8 + cos(fColor + time * fTime) * circle);
}

void main() {
    vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 colorOuterPat = vec3(1.0,0.1,1.0);
    vec3 colorBluePat = vec3(0.0,0.2,1.0);
    vec3 colorRedPat = vec3(1.0,0.0,0.3);
    vec3 colorYellowPat = vec3(0.9,0.5,0.0);
    
    float outer1 = sin(pos.x * pos.y) * 10.0;
    float outerPos = 0.1 / abs(dot(pos.x, pos.y) - 1.0 + sin(outer1 + time) * 0.01);
    
    colorOuterPat = (022.5 + (0.2 + sin(time)) * 0.5) * colorOuterPat;
    
    float blue = sin(pos.x * pos.y) * 10.0;
    float bluePos = getPos(pos, colorBlue, blue, 10.0);
    colorBluePat = (1.0 + sin(blue + time) * 0.1) * colorBluePat;
    
    float red = sin((pos.x + 0.25) * (pos.y)) * 12.0;
    float redPos = getPos(pos, colorRed, red, 11.0);
    colorRedPat = (1.0 + sin(red + time + 0.05) * 0.1) * colorRedPat;
    
    float yellow = sin((pos.x) * (pos.y - 0.5)) * 10.0;
    float yellowPos = getPos(pos, colorYellow, yellow, 12.0);
    colorYellowPat = (1.0 + sin(yellow + time + 0.1) * 0.1) * colorYellowPat;
    
    vec3 colorList = outerPos * colorOuterPat + bluePos * colorBluePat + redPos * colorRedPat + yellowPos * colorYellowPat;
    
    gl_FragColor = vec4(colorList, 1.0);
}