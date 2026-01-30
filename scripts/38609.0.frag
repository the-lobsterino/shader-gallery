#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D tex0;
vec2 ScreenPosition;
vec2 raySp;
vec2 pos = vec2(0.5,0.4);
vec4 colorArray[12];


float seed;
float Random(){
	seed = fract(seed + 2.182364*time);
	return seed;
}

float ConvertW2U(float pix){
	return pix / resolution.x;
}
float ConvertH2V(float pix){
	return pix / resolution.y;	
}

void InitParams(){
	for(int i = 0 ; i < 12 ; i+=1){
		colorArray[i] = vec4(Random(),Random(),Random(),1.);
	}
}

vec4 DrawBoxByPoint(vec2 position){
	vec4 col = vec4(0,0,0,1.);
	if(position.x + ConvertW2U(10.) > ScreenPosition.x && 
	   position.x - ConvertW2U(10.) < ScreenPosition.x &&
	   position.y - ConvertH2V(10.) < ScreenPosition.y &&
	   position.y + ConvertH2V(10.) > ScreenPosition.y){
		col = colorArray[0];	
	}	
	return col;
}

vec4 DrawCircle(vec2 position,float range){
	vec4 color;
	
	//screenPosition
	
	return color;
}
vec4 DrawSinBox(float x,float st){
	vec4 color;
	color = DrawBoxByPoint(vec2(x,sin(time*st)));
	return color;
}
float Sphere(vec3 pos , float s){
	return length(pos) - s;
}

float RepSphere(vec3 pos,float c , float s){
	vec3 q = mod(pos,c) - 0.5 * c;
	return Sphere(q,s);
}

vec3 genNormal(vec3 p){
    float d = 0.001;
    
    return normalize(vec3(
        Sphere(p + vec3(  d, 0.0, 0.0),1.) - Sphere(p + vec3( -d, 0.0, 0.0),1.),
        Sphere(p + vec3(0.0,   d, 0.0),1.) - Sphere(p + vec3(0.0,  -d, 0.0),1.),
        Sphere(p + vec3(0.0, 0.0,   d),1.) - Sphere(p + vec3(0.0, 0.0,  -d),1.)
    ));
}
vec4 AddMouse(){
	return vec4(1,1,1,1) * Sphere(vec3(mouse.x,mouse.y,10000.),0.02);
}

void main( void ) {
	vec4 color = vec4(0,0,0,0);
	
	ScreenPosition = ( gl_FragCoord.xy / resolution.xy ) ;
	raySp = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 cPos = vec3(0.,0.,-time);
	vec3 cDir = vec3(0.,0.,-1.);
	vec3 cUp = vec3(0.,1.,0.);
	vec3 cSide = cross(cDir,cUp);
	float depth = 1.0;
	
	vec3 ray = normalize(cSide * raySp.x + cUp * raySp.y + cDir * depth);
	
	
	float dist = 0.;
	float len = 0.;
	vec3 rPos = cPos;
	for(int i = 0 ; i < 32 ; ++i){
		
		dist = RepSphere(rPos,2.,0.5);
		len += dist;
		rPos = cPos + ray * len;
		
	}
	
	if(abs(dist) < 0.0001){
		vec3 normal = genNormal(rPos);
		vec3 light   = normalize(vec3(1.,1., 1.));
		float diff   = max(dot(normal, light), 0.1);
		color += vec4(vec3(diff), 1.);
	}
	
	
	pos += vec2(sin(time) * 0.1,0);
	InitParams();
	//color += DrawBoxByPoint(pos,position);
	//color += AddMouse();
	for(float i = 0. ; i < 1.0 ; i+= 0.1){
		color += DrawSinBox(i,pow(i,1.1));
	}
	gl_FragColor = color;
}