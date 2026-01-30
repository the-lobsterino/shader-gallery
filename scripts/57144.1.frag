#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



mat2 rot(float t){
	float s = sin(t);
 	float c = cos(t);
    
 	return mat2(c,s,-s,c);
}

float sdBox(vec3 p, float s) {
    p = abs(p) - s;
    return max(max(p.x, p.y), p.z);
}

float map(vec3 p){
    
    
    //p = -abs(p);
    vec3 pp = p;
    vec3 ppp = p;
    pp.z = mod(pp.z,.6)-0.3;
   // pp.xy = mod(pp.xy,.7)-.35;
    p = mod(p,.3) - .15;
    float d = sdBox(p,.1);
    float d2 = sdBox(pp,.3);
    float d3 = length(ppp-vec3(sin(time*0.8)*0.1,sin(time)*0.1,time+cos(time*0.4)*0.02)) -.1;
    ppp.xy *= rot(time);
	ppp.xz *= rot(time*0.3);
    d3 = max(d3,sdBox(mod(ppp -vec3(sin(time*0.8)*0.1,sin(time)*0.1,time+cos(time*0.4)*0.02),0.025)-0.0125,.01));

    return min(max(d,-d2),d3);   
}

vec3 getNormal(vec3 p){
    float s = 0.0001;
    return normalize(vec3(
        map(vec3(p.x+s,p.y,p.z))-map(vec3(p.x-s,p.y,p.z)),
        map(vec3(p.x,p.y+s,p.z))-map(vec3(p.x,p.y-s,p.z)),
        map(vec3(p.x,p.y,p.z+s))-map(vec3(p.x,p.y,p.z-s))
        ));
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy)  / min(resolution.x,resolution.y);
    vec3 ro = vec3(0.0,.0,-.5 + time);
    float screenZ = 1.;
    vec3 rd = normalize(vec3(uv,screenZ));
    
    rd.xz *= rot(sin(time*0.7)*0.3);
    rd.yz *= rot(sin(time*0.9)*0.1);
    rd.xy *= rot(cos(time*0.8)*0.1);

    // Time varying pixel color
    vec3 col = vec3(1.,1.,1.);
   // col = vec3(0.);
    vec3 rPos = ro;
    float depth;
        
    for(int i = 0; i < 225; i++){
    	float d = map(rPos);
        
        if(d < 0.0001){
            col = vec3(float(i)/225.0*1.5)*vec3(.2,.6,.7);
            break;
        }
                
    	depth += d;
    	rPos = ro + rd * depth;
        
    }

	gl_FragColor = vec4(col,1.0);

}