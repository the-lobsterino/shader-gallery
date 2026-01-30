#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distFunc(vec3 p){
	return length(p) - 2.8;
}

vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        distFunc(p + vec3(  d, 0.0, 0.0)) - distFunc(p + vec3( -d, 0.0, 0.0)),
        distFunc(p + vec3(0.0,   d, 0.0)) - distFunc(p + vec3(0.0,  -d, 0.0)),
        distFunc(p + vec3(0.0, 0.0,   d)) - distFunc(p + vec3(0.0, 0.0,  -d))
    ));
}

void main( void ) {
	vec2 dim = resolution;
	vec2 p = (gl_FragCoord.xy * 2.0 - dim) / min(dim.x,dim.y);
	
	// Camera
	vec3 cPos = vec3(0.0,0.0,3.0);
	vec3 cDir = vec3(0.0,0.0,-1.0);
	vec3 cUp = vec3(0.0,1.0,0.0);
	vec3 lightDir = vec3(-0.5, 0.5, 0.5);
	vec3 cSide = cross(cDir,cUp);
	float targetDepth = 0.1;
	
	// Ray
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
	
	// Loop
	float distance = 0.0;
	float distLen = 0.0;
	vec3  distPos = cPos;
	for(int i = 0; i < 16; i++){
        	distance = distFunc(distPos);
        	distLen += distance;
        	distPos = cPos + distLen * ray;
	}
	
	
	// normal line
    	vec3 normal = getNormal(distPos);
	
	// hit test
	if(abs(distance) < 0.001){
        	float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
        	vec3 color = vec3(1.0, 1.0, 1.0) * diff;
        	gl_FragColor = vec4(color, 1.0);
	} else {
		gl_FragColor = vec4(vec3(0.0), 1.0);
	}
}