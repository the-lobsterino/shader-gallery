#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


#define PI 3.14159265359
#define TWO_PI PI*2
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));}
vec2 scale(vec2 uv,vec2 _sc){
    float fix = resolution.x/resolution.y; 
    uv-=vec2(0.5*fix,0.5);
    uv = scale(_sc)*uv;
    uv+=vec2(0.5*fix,0.5);
    return uv;
}	
vec2 rotate2d(vec2 uv,float _rot){
    float fix = resolution.x/resolution.y; 
    uv-=vec2(0.5*fix,0.5);
    uv = rotate2d(_rot)*uv;
    uv+=vec2(0.5*fix,0.5);
    return uv;
}
float poly(vec2 uv,vec2 p, float s, float dif,int N,float a){
    vec2 st = p - uv ;
    float a2 = atan(st.x,st.y)+a;
    float r = PI*2. /float(N);
    float d = cos(floor(.5+a2/r)*r-a2)*length(st);
    float e = 1.0 - smoothstep(s,s+dif,d);
    return e;
}

	
void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution;
	float fix = resolution.x/resolution.y; 
    	uv.x*=fix;
	
	vec2 uv2 = uv; //copiamos las uvs para hacerlas independientes a cada objeto
    	vec2 uv3 = uv;
	vec2 uv4 = uv;
    
    	uv2.x-=0.5;
    	uv2.x+=sin(time*1.)*0.6; //TRANSLATE
    	uv2 = scale(uv2,vec2(6.8));  //SCALE
    	uv2 = rotate2d(uv2,time*2.); //ROTATE
    
    	uv3.x+=0.5;
    	uv3.y+=sin(time*5.)*0.2; //TRANSLATE
    	uv3 = scale(uv3,vec2(0.2));  //SCALE
    	uv3 = rotate2d(uv3,-time); //ROTATE
	
	uv4.x+=0.5;
    	uv4.y+=sin(time*10.)*0.4; //TRANSLATE
    	uv4 = scale(uv3,vec2(100.9));  //SCALE
    	uv4 = rotate2d(uv3,-time); //ROTATE
	
	vec2 p = vec2(0.5*fix,0.5) - uv;
	float r = length(p);
	float a = atan(p.x,p.y);
	
	vec2 p2 = vec2(0.5*fix,0.5) - uv;
	float r2 = length(p2);
	float a2 = atan(p.x,p.y);
	
	float circ = step(0.8999,0.9-r);
	float circ2 = step(0.1,9.9-a2)*sin(r2-.5*time);
	float ond1 = sin(r*40.*time*0.5*r);
	
	
	
	vec3 obj1 = vec3(poly(uv2,vec2(0.5*fix,0.9),6.2,0.1,3,10.9*r)*uv.y/2.);           
    	vec3 obj2 = vec3(poly(uv3*-uv.y,vec2(0.5*fix,0.),0.20,.015,3,.1-r*a));
	vec3 obj3 = vec3(circ*circ2,uv4*0.7-
			 sin(-r+ond1
			 +cos(uv.y/time*10.5
			 -sin(-r*10.) )));
	
												    
	gl_FragColor = vec4(obj1*3.+obj2+obj3*ond1, 1.0);

}