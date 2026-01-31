#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float Y_OFFSET = -10.;
const float PAW_SPACING = 7.;
const float PAW_HEIGHT = 12.;
const float HEAD_Y = 22.;
const float HEAD_Z = 2.;
const vec3  EYE_POS = vec3(-2.5, 12.5, -4.1);
const vec3  EAR_POS = vec3(6.0, 16., 1.);
const float DETAIL_K = 3.0;
const float MASS_K = 1.0;
 
mat3 rotX(float angle) { float cosa = cos(angle); float sina = sin(angle); return mat3(vec3(1., 0., 0.), vec3(0., cosa, sina), vec3(0., -sina, cosa));}
mat3 rotY(float angle) { float cosa = cos(angle); float sina = sin(angle); return mat3(vec3(cosa, 0., sina), vec3(0., 1., 0.), vec3(-sina, 0., cosa));}
mat3 rotZ(float angle) { float cosa = cos(angle); float sina = sin(angle); return mat3(vec3(cosa, sina, 0.), vec3(-sina, cosa, 0.), vec3(0., 0., 1.));}
 
vec3 transfo(vec3 m, float rx, float ry, float rz, float x, float y, float z) {
    
    mat3 rotation = rotX(rx) * rotY(ry) * rotZ(rz);
    vec3 translation = vec3(x, y, z);
    
    return (rotation) * (m - translation);
}

// iq made it
float smin( float a, float b, float k) {
    //k = k*2.;
    return min(a, b);
    //float res = exp2( -k*a ) + exp2( -k*b );
    //return -log2( res)/k  ;
}

float sdEllipsoid(vec3 m, vec3 r) {
    float k = length(m/r);
    return (k-1.0)*min(min(r.x,r.y),r.z);
}

float sdGoldBear(vec3 m) {

    m.y += 3.;

    float paw1 = sdEllipsoid(transfo(m, 0., 0., 0., -PAW_SPACING, Y_OFFSET+3., -5.), vec3(4., 4., 4.));  
    float paw2 = sdEllipsoid(transfo(m, 0., 0., 0.,  PAW_SPACING, Y_OFFSET+3., -5.), vec3(4., 4., 4.));    
    float paw3 = sdEllipsoid(transfo(m, 0., 0., 0., -PAW_SPACING, Y_OFFSET+PAW_HEIGHT, -5.), vec3(3., 3., 3.));  
    float paw4 = sdEllipsoid(transfo(m, 0., 0., 0.,  PAW_SPACING, Y_OFFSET+PAW_HEIGHT, -5.), vec3(3., 3., 3.));   

    float paws = smin(smin(paw1, paw2, MASS_K), smin(paw3, paw4, MASS_K), MASS_K*0.8);

    vec3 headm = transfo(m, 0.0, 0.0, 0., 0., HEAD_Y+Y_OFFSET, HEAD_Z);
    float head = sdEllipsoid(headm, vec3(8.5, 8., 6.));
    
    float eye1 = sdEllipsoid(transfo(headm, 0., 0., 0., -EYE_POS.x, EYE_POS.y + Y_OFFSET, EYE_POS.z), 0.9*vec3(1.3, 1.3, 0.6));     
    float eye2 = sdEllipsoid(transfo(headm, 0., 0., 0., +EYE_POS.x, EYE_POS.y + Y_OFFSET, EYE_POS.z), 0.9*vec3(1.3, 1.3, 0.6));         
    float nose = sdEllipsoid(transfo(headm, 0., 0., 0., 0., EYE_POS.y - 2.2 + Y_OFFSET, EYE_POS.z), vec3(1., 1., 0.6));             

    float headDetails = min(eye1, eye2);//min(min(eye1, eye2), nose);

    head = smin(head, headDetails, 10.);    

    float ear1 = sdEllipsoid(transfo(headm, 0., 0., 0., -EAR_POS.x, EAR_POS.y + Y_OFFSET, EAR_POS.z), vec3(2., 1.8, 1.)*1.2);     
    float ear2 = sdEllipsoid(transfo(headm, 0., 0., 0., +EAR_POS.x, EAR_POS.y + Y_OFFSET, EAR_POS.z), vec3(2., 1.8, 1.)*1.2);         

    float body = smin(head, paws, MASS_K);
    float body_and_ears = min(smin(body, ear1, DETAIL_K), smin(body, ear2, DETAIL_K));
    
    float body1 = sdEllipsoid(transfo(m, 0., 0., 0., 0., -2., 0.), vec3(10., 10., 8.));     


    return min(body_and_ears, body1);
}
const float CAMERA_DIST     = 45.;
const float CLOUD_THICKNESS = 2.;

float map(vec3 m) {
    return sdGoldBear(m);   
}

// iq made it
float perlin(vec3 v) {
    vec3 p = floor(v);
    vec3 f = fract(v);
	f = f*f*(3.0-2.0*f);
    v = p + f;
    
    return (v+0.5).x;
}

float noise(vec3 pos) {

    float total = 0.;

    float t = time * 1.0;

    total += perlin((pos+t) * 0.5)* 0.25;
    total += perlin((pos+t) * 1.) * 0.25;
    total += perlin((pos+t) * 2.) * 0.25;

    return total;
}

bool rayMarching(vec3 ro, vec3 rd, out vec3 m, float margin) {
    
    float marchingDist = 0.0;
    const float maxDist = 100.;

    float matter = 0.;

    for(int i = 0; i<100; i++) {
        
        m = ro + rd * marchingDist;    
        
        float dist = map(m) - margin*1.1;
        
        if(dist<0.01) {
            return true;
        }
    
        marchingDist += dist;
            
        if(marchingDist >= maxDist) {
            break;
        }
    }
    
	return false;    
}

float density(vec3 m) { 
    float dist = map(m);
    float shape = 1. - dist/CLOUD_THICKNESS;  
    return max(0., noise(m)*0.5 + shape * 1.)*0.1;
}

vec3 sun = vec3(-20., 20., 0.); 

float computeLight(vec3 m) {

    vec3 rd = normalize(sun-m);   
    
    float matter = 0.;

    float _step = 4.;

    for(int i=0; i<3; i++) {
        m += rd * _step;
        _step *= 1.5;
        matter += density(m);
    }

    return 1. - smoothstep(0., 1.25, matter);
}

vec3 matterMarch(vec3 ro, vec3 rd, vec3 sky) {
    
    float marchingDist = 0.;
    vec3 finalColor = vec3(0.);

    vec3 m;
    int i;
    float matter = 0.;
    float totalAlpha = 0.;

    float _step = 0.1;

    
        
        m = ro + rd * marchingDist;    
        
        float lighting = computeLight(m);
        
        float d = density(m)*3.;
        
        float alpha = (1. - totalAlpha) * d;
        
        totalAlpha += alpha;
        
        finalColor += alpha * vec3(lighting);
        
        
        marchingDist += _step;
        _step += 0.1;
     
    
	return finalColor += (1. - totalAlpha) * sky;  
}

vec3 sky(vec2 uv, vec3 rd) {
    const vec3 col1 = vec3(0.6,0.8,1.0);
    const vec3 col2 = vec3(0.6,0.8,1.0)*0.75;    
    const vec3 col3 = mix(col1, vec3(1.0), 0.5);
    vec3 col = mix(col1, col2, pow(length(uv), 2.));
    col = mix(col, col3, max(0.0, pow(dot(rd, normalize(sun)), 1.5)));
    return col;
}

vec3 computeNormal(in vec3 pos) { // iq
	vec3 eps = vec3( 0.1, 0.0, 0.0 );
	vec3 nor = vec3(
	     map(pos+eps.xyy) - map(pos-eps.xyy),
	     map(pos+eps.yxy) - map(pos-eps.yxy),
	     map(pos+eps.yyx) - map(pos-eps.yyx));
	return normalize(nor);
}

vec3 run(vec2 fragCoord) {

    vec3 m;
    vec2 uv;
    vec3 camera = vec3(0, 1., -CAMERA_DIST);
    vec3 ro = camera;
    vec3 rd;

    uv = (gl_FragCoord.xy - resolution.xy * 0.5) / resolution.y;
    rd	= normalize(vec3(uv.xy, 0.85));

    vec2 mouse = mouse.xy/resolution.xy;

    mat3 transfo = rotY(-mouse.x*4.*3.1415) * rotX(-mouse.y*4.*3.1415);

    ro = transfo * ro;
    rd = transfo * rd;    

    float lighting = 1.;
    float matter = 0.;

    return rayMarching(ro, rd, m, CLOUD_THICKNESS) ? matterMarch(m, rd, sky(uv, rd)) : sky(uv, rd);
    
    if(rayMarching(ro, rd, m, CLOUD_THICKNESS)) {
    
        vec3 normal = computeNormal(m);
        vec3 light = normalize(vec3(1, -1, 1));
    
        float diff = max(0.,dot(light, -normal));
    
        return vec3(0.25 + diff);
    }
    
    return vec3(0);
}


void main() {

    gl_FragColor = vec4(run(gl_FragCoord.xy), 1.);
} 


