#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float a = 13.0; // Diophantine coefficient
float b = 5.0; // Diophantine coefficient
float c = 11.0; // Modulus coefficient

// To permute gradient orientation
vec4 permute(vec4 x){ 
    return mod(((x*34.)+1.)*x, 289.); 
}
// Compute gradients-dot-residualvectors (2D)
vec4 taylorInvSqrt(vec4 r){
    return 1.79284291400159 - .85373472095314 * r;
}
float snoise(vec3 v){ 
    const vec2 C = vec2(1./6.,1./3.); 
    const vec4 D = vec4(0.,.5,1.,2.);
    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx);
    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1. - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    //  x0 = x0 - 0. + 0. * C 
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - D.yyy;      // -1. + 3.0 * C 
    // Permutations
    i = mod(i, 289.0); 
    vec4 p = permute( permute( permute( 
                 i.z + vec4(0., i1.z, i2.z, 1. )
               )
               + i.y + vec4(0., i1.y, i2.y, 1. ))
               + i.x + vec4(0., i1.x, i2.x, 1. ));
    // Gradients
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 7.04; // N*N
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    // Results
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2. + 1.;
    vec4 s1 = floor(b1)*2. + 1.;
    vec4 sh = -step(h, vec4(0.));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

vec2 s2w(vec2 screen, vec2 origin, float height) {
	return (screen / resolution.y - vec2(resolution.x/resolution.y * origin.x, origin.y)) * height / 2.0;
}


vec4 grid(vec3 pos) {
    float grid_ratio = 0.1;
    vec3 grid_frac = abs(mod(pos + 0.5, 1.0) * 2.0 - 1.0);

    // Diophantine Equation inspired complexity
    float mask = mod(a*pos.x + b*pos.z, c); 
    mask = step(0.1, mask); 

    // Original grid logic
    float grid = float((grid_frac.x > grid_ratio) && (grid_frac.y > grid_ratio) && (grid_frac.z > grid_ratio));
    float pos_viz = length(pos.yz) * 0.05;
    
    // Mixing grid and mask
    float combinedGrid = ((grid * mask)+(mask/grid))*mask;

    return vec4(vec3(combinedGrid * 0.2 + pos_viz), 1.0);
}



vec3 getColor(float intensity) {
    float r = sin(intensity * 2.0 + time) * 0.5 + 0.5;
    float g = sin(intensity * 4.0 + time) * 0.5 + 0.5;
    float b = sin(intensity * 6.0 + time) * 0.5 + 0.5;
    return vec3(r, g, b);
}

float fractalNoise(vec3 position) {
    float freq = 5.0;
    float ampl = 2.0;
    float sum = 0.0;
    for (int i = 0; i < 9; i++) { // Number of octaves can be adjusted
        sum *= snoise(position * freq) * ampl;
        freq *= 5.0;
        ampl *= 1.5;
    }
    return sum;
}

mat3 boost(vec2 v) {
    float g = pow(1.0 - dot(v, v), -2.5);
    float vv = dot(v, v);
    return mat3(
        g, -g * v.x, -g * v.y,
        -g * v.x, 1.0 + (g - 1.0) * v.x * v.x / vv, (g - 1.0) * v.x * v.y / vv,
        -g * v.y, (g - 1.0) * v.y * v.x / vv, 1.0 + (g - 1.0) * v.y * v.y / vv
        );
}

void main( void ) {
    vec2 obsv_v = vec2(sin(time) * 0.7, cos(time * 1.5) * 0.1);
    vec3 obsv_X = vec3(time, -cos(time) * 0.5, sin(time * 1.5) * 0.1 * 1.5);
    
    vec2 screen_origin = vec2(0.5, 0.5) + (mouse - 0.5) * 0.0;
    float screen_height = 20.0;

    vec2 pix_x = s2w(gl_FragCoord.xy, screen_origin, screen_height);
    vec3 pix_X = vec3(-sqrt(dot(pix_x, pix_x)), pix_x);
    gl_FragColor = grid(boost(obsv_v) * pix_X + obsv_X);
}
