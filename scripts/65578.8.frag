#define t time

#define PI 3.14159235659

// Author: koo1ant (maxisilva@gmail.com)
// IG: @pecsimax

precision highp float;


uniform float visualizeSDF;
uniform vec2 resolution;
uniform float time;
uniform float v;

// Settings
const float swingSpeed = 4.;
const float starSize = 0.6;


float circle(vec2 uv, vec2 pos, float radius)
{
    return 1.-step(radius, length(pos-uv));
}

float fractSDF(vec2 uv, vec2 pos, float radius)
{
    float dv = length(pos-uv);
    return step(0.1, 
        fract(dv*radius*20.)) * 0.2+
        sin(dv*radius*5.-time*5.)*0.16;
}

vec2 setupSpace(in vec2 c,in vec2 r) // Normalized device coordinates
{ 
    return vec2(
        c.x - (r.x-r.y)*.5,
        c.y
    ) / r.y * 2.-1.;
}

void main() 
{
    
    vec2 uv = setupSpace(gl_FragCoord.xy, resolution); // Distorted space
    vec2 uv2 = setupSpace(gl_FragCoord.xy, resolution); // Less distorted space for the insides    
    vec2 uvu = setupSpace(gl_FragCoord.xy, resolution);
    
     // Get angle before UV modulation to distort shape
    float a = atan(uv.x, uv.y);
    float a2 = atan(uvu.x, uvu.y);
    

    // Modulate space
    uv.x += sin(t*swingSpeed)*0.1;
    uv.y += cos(t*swingSpeed)*0.1;
    
    uv2.x += sin(t*swingSpeed)*0.05;
    uv2.y += cos(t*swingSpeed)*0.11;
    
    // Draw star
    float fn = sin(a*5.-5.)*0.15;
    float fn2 = sin(a*20.+t*5.)*0.004;
    float fn3 = sin(a*20.-t*10.)*0.004;
    
    float fnOutline = sin(a*20.+t*10.)*0.008;
    
    // Body
    float outer = circle(uv, vec2(0), starSize+fn+fn2+fn3);
    float inner = circle(uv, vec2(0), starSize*0.80+fn+fn2+fn3);
    
    // Insides

    float aouter = circle(uv, vec2(0), starSize+fn+fn2+fn3+fnOutline);
    float ainner = circle(uv, vec2(0), starSize*0.98+fn+fn2+fnOutline);

    float simleFn = 0.2 + sin(t*0.5)*0.1;
    float smileA = circle(uv2*5.5, vec2(0.0, -0.5), 0.1 + simleFn);
    float smileB = circle(uv2*5.5, vec2(0, -0.3), 0.2 + simleFn);
    
    float eyePosY = 0.3;
    float eyeFn = 0.3+sin(t*0.8)*0.05;
    float eyeL = circle(uv2 * 5.5, vec2(-0.8, eyePosY), eyeFn + 0.03) * 0.5;
    float eyeR = circle(uv2 * 5.5, vec2(0.8, eyePosY), eyeFn) * 0.5;

    float fnc = sin(a*5.+4.5)*0.2;
    float contour = fractSDF(uv, vec2(0), starSize+fnc+fnOutline);



    // Final shapes
    vec3 shape = vec3(outer-inner);    
    vec3 ashape = vec3(outer-ainner);
    vec3 smile = vec3(smileA*10.5-smileB*12.-contour-inner);
    
    
    vec3 color = vec3(
        shape * 0.2 +
        ashape * 0.3 +
        eyeL*10. +
	eyeR*10. +
	smile);
     
        color.b = 0.0;
    
    gl_FragColor = vec4(vec3(color-inner),1.);
}
