#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi2 = 2.0 * acos(-1.0);
const float numRhombus = 16.0;
const float divCircle = 32.0;
const float quantization = 2.0;
    
float calMask(float src){
    return 1.0 - step(src, 0.2*abs(sin(time)));
}

vec3 calColor(float i, float quant){
    float r = mod(i, quant);
    float g = mod(floor(i/quant), quant);
    float b = mod(floor(i/(pow(quant, 2.0))), quant);
    return vec3(r, g, b);
}
    
void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 f = vec3(0.0);
    float time = time / 2.0;
    float isin = sin(0.6*pi2*time);
    float icos = cos(0.3*pi2*time);
    mat2 rot = mat2(icos, isin, -isin, icos);

    for(float i = 1.0; i <= numRhombus; i++){
        vec2 q = p + vec2(1.2 * cos(pi2*time+i*pi2/divCircle), 0.2* sin(pi2*time+i*pi2/divCircle));
        vec2 pq = q * rot;
        float rhombus = 0.1 / (pow(abs(pq.x), 0.4) + pow(abs(pq.y)+0.2, 0.9));
        float masked = rhombus * calMask(rhombus);
        vec3 dstColor = calColor(i, quantization);
        f += masked * dstColor;
   }
   gl_FragColor = vec4(vec3(f), 1.0);
}