#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hexagon(float x, float y, float c){
	return 2.0*abs(y)+abs(sqrt(3.0)*x-y)+abs(sqrt(3.0)*x+y)-c*2.0*sqrt(3.0);
}

void main( void ) {

	vec2 pos = gl_FragCoord.xy - resolution.xy/2.0;
	float x = pos.x*2.0;
	float y = pos.y*2.0;
	vec3 color = vec3(1);
	float b = (mouse.x+mouse.y)*10.;
	float a =32. + (mouse.x+mouse.y)*32.;
	float aa = 5.5*a;
	float aaa = 4.0*aa;
	float aaaa = 4.0*aaa;
	
	float x1 = mod(x, a*3.00);
	float y1 = mod(y, a*sqrt(3.0));
	float x2 = mod(x-1.5*a, a*3.0);
	float y2 = mod(y-0.5*sqrt(3.)*a, a*sqrt(3.0));
	float dekab = b*1000.;
	
	float me = pow(x+aa/1.5, 2.) + pow(y+aa/3., 2.) - pow(aa/13., 2.);
	float sen1 = pow(x+1.25*aa, 2.) + pow(y+aa/20.0, 2.) - pow(0.92*aa, 2.);
	float sen2 = pow(x+1.2*aa, 2.) + pow(y, 2.) - pow(1.2*aa, 2.);
	float sen3 = pow(x+1.33*aa, 2.) + pow(y, 2.) - pow(1.6*aa, 2.);
	float sen4 = pow(x+1.65*aa, 2.) + pow(y-aa/12.0, 2.) - pow(2.2*aa, 2.);
	float sen5 = pow(x+1.77*aa, 2.) + pow(y-aa/4.0, 2.) - pow(2.6*aa, 2.);
	float jougen = pow(x, 2.) + pow(y-sqrt(12.0)*aa, 2.) - 12.*pow(aa, 2.);
	float kagen = pow(x, 2.) + pow(y-sqrt(10.8)*aa, 2.) - 12.*pow(aa, 2.);
	float circle = pow(x, 2.) + pow(y, 2.) - pow(aa, 2.);
	
	if(circle<=0.)
	if(jougen<=0.)
	if(abs(hexagon(x1-a, y1-a*sqrt(3.0)/2.0, a))<=b||abs(hexagon(x2-a, y2-a*sqrt(3.0)/2.0, a))<=b) 
		color = vec3(-1);
	else 
		color = vec3(1, 0, 0);
	
	if(abs(circle)<=aaa||me<=0.)
		color = vec3(-1);
	
	if(circle<=0.)
	if(abs(jougen)<=aaaa||abs(kagen)<=aaaa)
		color = vec3(-1);
	
	if(circle<=0.)
	if(kagen>=0.)
	if(abs(sen1)<=aaa||abs(sen2)<=aaa||abs(sen3)<=aaa||abs(sen4)<=aaa||abs(sen5)<=aaa)
	color = vec3(-1);
	
	gl_FragColor = vec4( color, 1.0 );

}