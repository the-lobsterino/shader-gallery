#define t time

#define PI 3.14159235659

// WIP
// Author: koo1ant (maxisilva@gmail.com)
// IG: @pecsimax

precision highp float;

uniform vec2 resolution;
uniform float time;

float makeSDF(float sdf, float modFn, float edge)
{
    return 1.0 - smoothstep(edge - 0.005, edge, sdf + modFn);
}

float makeSDF(float sdf, float edge)
{
    return makeSDF(sdf, edge, 0.0);
}

float makeSDF(float sdf)
{
    return makeSDF(sdf, 0.0, 0.0);
}

vec2 setupSpace(in vec2 coord, in vec2 res)
{
    return vec2(
        coord.x - (res.x - res.y) * 0.5,
        coord.y
    ) / res.y * 2.0 - 1.0;
}

float sdCircle(vec2 pos, float r)
{
    return length(pos) - r;
}

mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), - sin(_angle),
    sin(_angle), cos(_angle));
}

vec2 p(vec2 uv) {
    return vec2(0) - uv;
}

void main()
{
    float radius = 0.35;
    
    vec2 uv = setupSpace(gl_FragCoord.xy, resolution) * 1.0;
    vec2 guv = uv;
    float beatMult = 0.5;

    uv*=rotate2d(sin(t*0.1))+ 0.01+abs(sin(t*0.1))*0.1; // "Camera"

    uv*= 1.+ sin(t*0.5)*0.8;

    uv.x += sin(t * 0.1);
    uv.y += cos(t * 0.1);
    uv = fract(uv);
    uv -= 0.5;

    
    

    float a = atan(uv.x, uv.y); // Angle from origin
    
    float fnw = sin(uv.x * 12.57 + t*3.0) * 0.05;
    float m = fnw - 0.26 /*+ mod(t,2.)*/;
    float aInside = atan(uv.x - m, uv.y - m); // Angle from origin
    
    float var = sin(guv.x * 20.0);// Use a pre-frac UV to add some variance
    float fn = pow(sin(a * 2.00 + t*5.0) * sin(t * 10.0 + sin(a * 10.0 )) * 0.15 - 0.1 + abs(sin(t * 2.50 * beatMult)), 5.0) * 0.10 * var;
    //float fn = (floor(sin(t * 0.5))) * abs(pow(sin(t), 6.0) * 0.5);
    float fnInside = sin(aInside * 0.0 - t*5.0) * 0.005 + var*0.01;
    vec2 grid_uv = vec2(uv.x , uv.y);
    float grid = makeSDF(sdCircle(p(grid_uv), 0.54), 0.20, fn);
    
    float innerRingSize = 0.18;
    vec2 circleUV[6];
    circleUV[0] = vec2(uv.x , uv.y + 0.25 + m);
    circleUV[1] = vec2(uv.x , uv.y + -0.75 + m);
    circleUV[2] = vec2(uv.x , uv.y + -1.75 + m);
    
    circleUV[3] = vec2(uv.x , uv.y + 0.25 + m);
    circleUV[4] = vec2(uv.x , uv.y + -0.75 + m);
    circleUV[5] = vec2(uv.x , uv.y + -1.75 + m);
    
    float shape = grid;
    for(int i = 0; i < 3; i ++ ) {
        shape -= makeSDF(sdCircle(p(circleUV[i]), innerRingSize), - fnInside, fnInside);
    }
    
    float beatingFn = (floor(sin(t * 10.0 * 0.5))) * abs(pow(sin(t * 10.0), 6.0) * 0.5);
    for(int i = 3; i < 6; i ++ ) {
        shape += makeSDF(sdCircle(p(circleUV[i]), innerRingSize * 0.39 - beatingFn * 0.06 * beatMult), 0.0, fnInside);
    }
    
    float fnw3 = sin(uv.x * 12.57 + t*3.0) * 0.05;
    
    //float waveW = -0.05 + abs(sin(t*0.1)) * 0.005 ;
    vec2 waveUV = setupSpace(gl_FragCoord.xy, resolution);
    float wwm = 1.00;
    waveUV.x += t;
    float waveW = + - 0.07 + abs(sin(waveUV.x * 1.0) * 0.1) * 0.51;

    float fiend = + - 0.03 + abs(sin(waveUV.x * 1.0) * 0.1) *- 1.1;
    float fiendw = sin(uv.x * 12.57 + t*3.0) * 0.04;
    
    float wave =
    smoothstep(0.095, 0.100, fnw + sin(uv.y + 0.01 - waveW)) -
    smoothstep(0.095, 0.100, fnw + sin(uv.y - -0.18 + waveW));
    
    float wave3 =
    smoothstep(0.095, 0.100, fnw3 + sin(uv.y + 0.18 + waveW)) -
    smoothstep(0.035, 0.100, fnw3 + sin(uv.y - -0.19 + waveW));
    
    float subWave =
    smoothstep(0.095, 0.100, fiendw + sin(uv.y + -0.01 - fiend * wwm)) -
    smoothstep(0.095, 0.100, fiendw + sin(uv.y - -0.22 + fiend * wwm));
    
    // Setup color
    vec3 color = vec3(shape);
    color.b = 0.28 + subWave;
    color.g -= 1.8;
    color.g *= wave * 0.5;
    color.r *= wave3 + 1.47;
    color *= mix(color, vec3(0.56 + abs(sin(t * 5.0)) * 0.2), vec3(0.459, 3.049, 0.4314));
    
    color *= mix(vec3(1.0, 1.0, 1.0), vec3(sin(uv.y * PI * 2.0)), vec3(-0.2)*var);
    
    gl_FragColor = vec4(color, 1.0);
}

