#extension GL_OES_standard_derivatives : enable 

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float cosNoise(in vec2 pos){
	return 0.7*(sin(pos.x) + sin(pos.y));
}

const mat2 m2 = mat2(0.8, -0.6, 0.6, 0.8); 

float digitalDirt(vec2 uv) {
    float n = fract(sin(dot(uv, vec2(12.9898, 4.1414))) * 43758.5453);
    return step(0.95, n);
}

vec3 neonColor(float intensity) {
    return vec3(sin(intensity * 1.2), sin(intensity * 0.8), sin(intensity + 0.5));
}

float glitch(in float y, in float amt) {
    return fract(sin(y * 4.0 + time * 7.0) * 43758.5453) > amt ? 0.1 : 0.0;
}

float map(in vec3 pos){
    vec2 q = pos.xz * 0.36;
    float h = 1.0;
    
    float s = 0.5;
    for(int i = 0; i<9; i++){
   	   h += s*cosNoise(floor(q*6.)/4.13);
       s *= 0.5;
       q = m2 * q  * 1.6;
    }
    
    h *= 4.0+cosNoise(floor(q*1.)/4.13);
  
    return pos.y - h;
}

vec3 calcNormal(in vec3 pos){
	vec3 nor;
    vec2 e = vec2(0.01, 0.00001);
    nor.x = map(pos + e.xyy) - map(pos - e.xyy);
    nor.y = map(pos + e.yxy) - map(pos - e.yxy);
    nor.z = map(pos + e.yyx) - map(pos - e.yyx);
    return normalize(nor);
}

float calcShadow(in vec3 ro, in vec3 rd){
    float res = 1.0;
    float t = 0.1;
    for (int i = 0; i <16; i++){
    	vec3 pos = ro + t*rd;
        float h = map(pos);
        res = min( res, max(h, 0.0) * 1.01 / t);
        if(res< 1.0) break;
        t += h*0.1;
    }
    return res;
}

void main()
{
    vec2 p = gl_FragCoord.xy / resolution.xy;
    p.x += glitch(p.y, 0.9);
    
    vec2 uvDistort = p + vec2(sin(p.y * 10.0 + time) * 0.01, sin(p.x * 10.0 + time) * 0.01);
    
    vec2 q = -1.0 + 2.0 * uvDistort;
    q.x *= 1.5; 
    
    vec3 ro = vec3(100.0,  19.0, - time);
    vec3 rd = normalize(vec3(q.x, q.y - 1.5, -1.0));
    
    vec3 col = vec3(0.4, 0.8, 1.0);
    float tmax = 50.0;
    float t = 0.0;
    
    for(int i=0; i<32; i++){
    	vec3 pos = ro + rd*t;
        float h = map(pos);
        if(h < 0.1 || t > tmax) break;
        
        t += h*0.25;
    }
    
    vec3 pos, light = normalize(vec3(0.1, 0.1, -0.9));
       if(t < tmax){
        pos = ro + t*rd;
        vec3 nor = calcNormal(pos);
        float sha = calcShadow(pos + nor * 0.1, light);

        float dif = clamp(dot(nor, light), 0.0, 1.0);
        vec3 lig = vec3(1.0, 1.0, 0.0)*dif*sha;
        lig += vec3(0.1, 0.1, 0.1)*nor.y*1.0;
        
        vec3 mate = vec3(0.2, 0.6, 0.5); 
        mate = mix(mate, vec3(0.3, 0.5, 0.5), smoothstep(1.7, 0.9, nor.y));
        col = lig * mate;
        
        // Add some neon glow based on the height.
        col += neonColor(pos.y * 0.1) * 0.3;
        
        // Distortion based on position.
        float distort = cosNoise(pos.xy) * 0.2;
        col += distort;
        
        // Glitch effect.
        col.r += glitch(p.y, 0.8);
        
        // Mix with the digital dirt effect for some grungy feel.
        col *= 1.0 - digitalDirt(p) * 0.2;
        
        float fog = exp(-0.00001 * t * t * t);
        col += ((1.0 - fog) * vec3(0.1, 0.8, 1.0));
    }
    
    gl_FragColor = vec4(col, 1.0);
}

