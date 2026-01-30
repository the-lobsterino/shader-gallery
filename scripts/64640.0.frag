precision mediump float;
uniform vec2  resolution;   
uniform vec2  mouse;    
uniform float time;      
uniform sampler2D prevScene;

float dTorus(vec3 p){

    float r = 0.3;
    float R = 1.0;

   vec2 q = vec2(length(p.xy)-R,p.z);
   return length(q)-r;

}

vec3 nTorus(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        dTorus(p + vec3(  d, 0.0, 0.0)) - dTorus(p + vec3( -d, 0.0, 0.0)),
        dTorus(p + vec3(0.0,   d, 0.0)) - dTorus(p + vec3(0.0,  -d, 0.0)),
        dTorus(p + vec3(0.0, 0.0,   d)) - dTorus(p + vec3(0.0, 0.0,  -d))
    ));
}

float dSphere(vec3 p){

    float r = 0.5;
	
   return length(p)-r;

}

vec3 nSphere(vec3 p){

    float r = 0.5;
	
   return p/r;

}

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 cPos = vec3(0.0,  0.0,  3.0); 
    vec3 cDir = vec3(0.0,  0.0, -1.0);
    vec3 cUp  = vec3(1.0,  0.0,  0.0); 
    vec3 cSide = cross(cDir, cUp);    
    float targetDepth = 2.0;         

    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

    float dist = 0.0;
    float rLen = 0.0; 
    vec3  rPos = cPos;
    
    vec3  lPos = rPos+ray;

	
    vec3 v1 = vec3(1.,-1.,2.);
    vec3 v2 = vec3(1.,0.,2.);
    vec3 v3 = vec3(-1.,0.,2.);
    vec3 n = cross(v1,v2);
    
    float u = dot(n,v1-cPos)/dot(n,ray);
	
	
    for(int i=0; i<6; i++)
    {
	
    v1 += vec3(1.,-1.,2.+float(i));
    v2 += vec3(1.,0.,sin(time));
    v3 += vec3(-1.,0.,0.);
    n = cross(v1,v2);
    
    u = max(u, dot(n,v1-cPos)/dot(n,ray));
}
	
	
	
    vec3 c = vec3(u)*.1;
    gl_FragColor = vec4(c,1.0);
    
	
}