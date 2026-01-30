precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;
vec3  cPos = vec3(0.0, 0.0, 2.0);
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

vec3 rotate(vec3 p, float angle, vec3 axis){
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}

const int Iterations = 8;
const float Scale = 2.0;
float distanceFunc(vec3 z)    {   
   z = rotate(z, radians(time * 10.0), vec3(1.0, 0.5, 0.0));
   vec3 a1 = vec3(1,1,1);                              
   vec3 a2 = vec3(-1,-1,1);                            
   vec3 a3 = vec3(1,-1,-1);                            
   vec3 a4 = vec3(-1,1,-1);                            
   vec3 c;                                             
                                          
   float dist, d;

   for(int n = 0; n < Iterations ; n++){
     c = a1; dist = length(z-a1); 
     d = length(z-a2); if (d < dist) { c = a2; dist=d; } 
     d = length(z-a3); if (d < dist) { c = a3; dist=d; } 
     d = length(z-a4); if (d < dist) { c = a4; dist=d; } 
     z = Scale*z-c*(Scale-1.0);                                                                       
   }                                                   
   return (length(z) - 1.) * pow(Scale, float(-Iterations));           
}



vec3 getNormal(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
        distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
        distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
    ));
}



void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));	
    
    float distance;
    float rLen = 0.0;
    vec3  rPos = cPos;
    for(int i = 0; i < 16; i++){
        distance = distanceFunc(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
    }
    
    // hit check
    if(abs(distance) < 0.01){
        vec3 normal = getNormal(rPos);
        float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        gl_FragColor = vec4(vec3(diff), 1.0);
    }else{
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}