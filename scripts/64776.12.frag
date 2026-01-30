#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//precision mediump float;


//#version 150

//out vec4 outputColor;
//uniform float t;
//uniform vec2 r;
uniform vec2 mouse;


uniform float time;
uniform vec2 resolution;
uniform float vol;
float step_f(){
	float st=time*0.2;
	if(mod(st*73.,1200.)==0.){
		return 1.;	
	}
	else{
		return 0.;
	}
}
void main(void){
	
	float t=time;
	vec2 r=resolution;
	
	
    vec2 p = (gl_FragCoord.xy * 2.0 - r) / max(r.x, r.y);
    vec3 destColor = vec3(.1, .1, .1);
    float f = 0.;


	float x,y;
	float vol=1.;
	float freq=0.;
	x= -1.;
	y= 0.;

	float st=t*0.2;

	for(float i = 0.; i <= 160.; i+=1.0){
	float m =st+x*0.2;

	y=0.2*sin(10.*m)*(vol*sin(73.*m))*step_f();
		
	x+=0.0125;
		
        f += 0.1 / abs(length(p + vec2(x,y)) *10.+0.01);
	}	
	
	
	
    gl_FragColor= vec4(vec3(destColor * f), 1.);    


}