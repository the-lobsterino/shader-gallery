/*
Interference1 by SteelFlame
https://www.shadertoy.com/view/sljSWK
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 point1 = vec2(0.5,0.5);
vec2 point2 = vec2(0.1,0.1);
vec2 point3 = vec2(.9,0.5);

vec2 lineStart = vec2(0.3,0.2);
vec2 lineEnd = vec2(0.5,0.2);

float frequency = 60.;

float rayLineDst(vec2 p1, vec2 p2, vec2 origin, vec2 direction, float thickness) {
    vec2 lineNormal = normalize(vec2(p1.y-p2.y,p2.x-p1.x));
    float t = dot(p1-origin,lineNormal)/dot(direction,lineNormal);
    vec2 pos = origin+direction*t;
    float alongLineT = dot(p1-pos,-normalize(p2-p1));
    if (alongLineT < 0. || alongLineT > length(p2-p1)) return 0.;
    return t;
}

void main(void)
{
    vec4 fragColor=vec4(1.);
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    
    //frequency = pow(sin(time*0.1),2.)*300.;
    
    point2 = mouse.xy;	// /iResolution.xy;
    
    float v1 = (sin(length(uv-point1)*frequency-time*0.));
    float t1 = rayLineDst(lineStart,lineEnd,uv,-normalize(uv-point1),0.);
    
    float v2 = (sin(length(uv-point2)*frequency-time*0.));
    float t2 = rayLineDst(lineStart,lineEnd,uv,-normalize(uv-point2),0.);
    
    float v3 = (sin(length(uv-point3)*frequency))*0.;
    
    float v = 0.;
    if (t1 <= 0. || t1 > length(point1-uv)) {
        v+=v1;
    } else {
        vec2 pos = uv-normalize(uv-point1)*t1;
        float alongLineT = dot(lineStart-pos,-normalize(lineEnd-lineStart));
        float inLineTUv = alongLineT/length(lineEnd-lineStart);
        inLineTUv -= 0.5;
        inLineTUv *= 2.;
        inLineTUv = abs(inLineTUv);
        
        v+=v1*(inLineTUv*inLineTUv*inLineTUv);
    }
    if (t2 <= 0. || t2 > length(point2-uv)) {
        v+=v2;
    } else {
        vec2 pos = uv-normalize(uv-point2)*t2;
        float alongLineT = dot(lineStart-pos,-normalize(lineEnd-lineStart));
        float inLineTUv = alongLineT/length(lineEnd-lineStart);
        inLineTUv -= 0.5;
        inLineTUv *= 2.;
        inLineTUv = abs(inLineTUv);
        
        v+=v2*(inLineTUv*inLineTUv*inLineTUv);
    }
    fragColor = vec4(v,0.,-v,1.);


    float inLineT = dot(uv-lineStart,normalize(lineEnd-lineStart));
    float lineDst = pow(length(uv-lineStart),2.)-pow(inLineT,2.);
    if (sqrt(lineDst) < 0.004 && (inLineT > 0. && inLineT < length(lineEnd-lineStart))) {
        fragColor = vec4(.55,.5,.69,1.);
    }
gl_FragColor=fragColor;
}