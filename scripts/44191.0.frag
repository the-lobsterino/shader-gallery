#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

const float scale = 0.01;

uniform float time;
uniform vec2 resolution;

vec3 Z(vec3 p, float a) {
	float c = cos(a);
	float s = sin(a);
    return vec3(c * p.y + s * p.x, c * p.x - s * p.y, p.z);
}

float F(vec3 P) {
    float R = sin((time * scale + P.z * 0.01) * 3.176) * 0.45 + 0.5;
    float S = 3.4312 - sin(time * scale * 0.1);
    
    float ss = sin(time * scale * 0.012211154) * 3.0172;
    
    vec4 p = vec4(P, 1.0);
    
    for (int i = 0; i < 24; i++) {
    	p.xyz = clamp(p.xyz, -1.0, 1.0) * 2.0 - p.xyz;
        float r2 = dot(p.xyz, p.xyz);
        
        if (r2 > 1000.0) 
        	break;
        
        if ((i - int(i / 4)) == 3) 
        	R = sin(time * scale * 3.176 + P.z * 0.03176 + float(i) * ss) * 0.45 + 0.5;
        
        p = p * (clamp(max(R / r2, R), 0.0, 1.0) * S / R) + vec4(P, 1);
    }
    
    return (length(p.xyz) - S + 1.0) / p.w;
}

float D(vec3 p) {
    p = mod(p, vec3(10.0, 10.0, 8.0)) - vec3(5.0, 5.0, 4.0);
    vec3 q = abs(Z(p, p.z * 1.2566));
    float d2 = max(q.z - 10.0, max((q.x * 0.866025 + q.y * 0.5), q.y) - 0.08);
    p = Z(p, p.z * 0.25132 * (length(p.xy) - 3.0) * sin(time * scale * 0.01));
    return max(F(p), -d2);
}

vec3 R(vec3 p, vec3 d) {
    float td = 0.0, rd = 0.0;
    for (int i = 0; i < 80; i++) {
        if ((rd = D(p)) < pow(td, 1.5) * 0.004) 
        	break;
        td += rd;
        p += d * rd;
    }
    
    vec3 n = normalize(vec3(
	    D(vec3(p.x + 0.0025, p.y, p.z)) - D(vec3(p.x - 0.0025, p.y, p.z)), 
	    D(vec3(p.x, p.y + 0.0025, p.z)) - D(vec3(p.x, p.y - 0.0025, p.z)), 
	    D(vec3(p.x, p.y, p.z + 0.0025)) - D(vec3(p.x, p.y, p.z - 0.0025)))
    );
    
    vec3 nn = p + n * 0.02;
    
    float occ = 0.4 + (
	    D(vec3(nn.x - 0.00125, nn.y, nn.z)) + 
	    D(vec3(nn.x + 0.00125, nn.y, nn.z)) + 
	    D(vec3(nn.x, nn.y - 0.00125, nn.z)) + 
	    D(vec3(nn.x, nn.y + 0.00125, nn.z)) + 
	    D(vec3(nn.x, nn.y, nn.z - 0.00125)) + 
	    D(vec3(nn.x, nn.y, nn.z + 0.00125))
    ) * 20.0;
    
    occ = clamp(occ, 0.0, 1.0);
    float br = (pow(dot(n, -normalize(vec3(d.x + 0.3, d.y - 0.9, d.z + 0.4))) * 0.6 + 0.4, 2.7) * 0.8 + 0.2) * occ / (td * 0.5 + 1.0);
    float fog = clamp(1.0 / (td * td * 1.8 + 0.4), 0.0, 1.0);
    return mix(vec3(br, br / (td * td * 0.2 + 1.0), br / sin(td + 1.0)), vec3(0.0), 1.0 - fog);
}

void main() {
    vec2 f = gl_FragCoord.xy;
    vec3 d = vec3(
    f.x / 120.0 - resolution.x / 240.0, 
    f.y / 120.0 - resolution.y / 240.0,
    1.0);
    
    vec3 c = pow(R(vec3(5.0, 5.0, time * scale * 10.0), normalize(d * vec3(1.0, 1.0, 1.0 - (length(d.xy) * 0.9)))), vec3(0.6));
    
    gl_FragColor = vec4(pow(floor(c * vec3(8.0, 8.0, 4.0) + fract(f.x / 4.0 + f.x / 2.0) / 2.0) / (vec3(2.0,7.0, 7.0)), vec3(1.5)), 1.0);
}