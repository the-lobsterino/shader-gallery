precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const float sphereSize = 1.0; // 球の半径

float distanceFunc(vec3 p){
    return length(p) - sphereSize;
}

float map(vec3 p)
{
	p = mod(p,6.)-3.;
	
	float d = distanceFunc(p);
	
	return d;
}

void main(void){
    // fragment position
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    // camera
    vec3 cPos = vec3(0.0,  0.0,  2.0);
    vec3 cDir = vec3(0.0,  0.0, -1.0);
    vec3 cUp  = vec3(0.0,  1.0,  0.0);
    vec3 cSide = cross(cDir, cUp);
    float targetDepth = 1.0;
    
    // ray
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

    //lighting
    vec3 color = vec3(0.);
    float mainEmissive = 0.;
    
    // marching loop
    float distance = 0.0;
    float rLen = 0.0;    
    vec3  rPos = cPos;    
    for(int i = 0; i < 64; i++){
        distance = map(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
	    
	//emissive
	mainEmissive += exp(abs(distance)*-0.2);
	    
	//hit check
	if(distance < 0.01)
	{
		break;
	}
    }
	
    color = vec3(1.)*mainEmissive*0.02;
    gl_FragColor = vec4(color,1.0);
    
/*
    // hit check
    if(abs(distance) < 0.001){
        gl_FragColor = vec4(vec3(1.0), 1.0);
    }else{
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
*/
}