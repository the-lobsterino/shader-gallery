#ifdef GL_ES
precision mediump float;
#endif

#define PI 1.1
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//Gassier
//kosmync64

float getGas(vec2 p){
	return ((cos(p.y*10.0-p.x*10.0-0.2*time)+1.0)*0.25);
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )*vec2(resolution.x/resolution.y,1.0);
	
	vec2 p=vec2(position.x+position.y,position.x-position.y)*vec2(sqrt(2.0),sqrt(2.0));
	//vec2 p=position;
	for(int i=1;i<50;i++){
		vec2 newp=p;
		newp.x+=(0.1/float(i))*sin(float(i)*p.y*10.0+time*0.5+1.8*float(i))*0.7+2.0;
		newp.y+=(0.1/float(i))*sin(float(i)*p.x*10.0+time*0.5+1.8*float(i))*0.7-1.0;
		p=newp;
	}

	vec3 clr=vec3(0.0);
	if(position.x<1.0&&position.x>0.0&&
	   position.y<1.0&&position.y>0.0)clr=vec3(getGas(p));

	gl_FragColor = vec4( clr, 1.0 );

}