#ifdef GL_ES
precision highp float;
#endif

// trixelized

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float hash(in float n)
{
    return fract(sin(n)*43758.5453123);
}

float hash (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233))) * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);
    
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float clouds(vec2 uv, float t) {
    
    vec2 r_uv = rotate2d(sin(t) * 0.1) * uv;
    vec2 o_uv = 80.0 * vec2(noise(vec2(sin(t * 0.1), cos(t * 0.1))), noise(1.0 + vec2(sin(t * 0.1), cos(t * 0.1))));
    
    float c = 0.0;
    float s = 2.0;
    for (int i=0; i<50; i++) {
    	
        vec2 add = vec2(hash(float(i) + 0.02)*40.0, hash(float(i) + 0.01)*40.0);
        c += noise(add + ((r_uv + o_uv / s) * s)) / (s * 0.222);
        
        s *= 1.136;
        
    }
    c *= 0.075;
    
    return pow(c, 1.2);
    
}

void main() {
    vec2 uv = gl_FragCoord.xy/resolution.xy - 0.5;
    
    uv.x *= (resolution.x/resolution.y);
	
    vec3 col = vec3(0.0);
    col = vec3(clouds(uv * (1.0+0.2*sin(time * 0.333)), time * 0.2));
	
    col = mix(
        col,
        vec3(0.5 + 0.5*sin(time+uv.yxx+vec3(0,2,4))),
        0.3
    );		
	
    col *= pow(1.0 - length(uv) * 0.75, 0.9);
	
    
    
    
    gl_FragColor = vec4(col, 5.0);
}

