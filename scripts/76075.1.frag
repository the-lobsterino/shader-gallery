#extension GL_OES_standard_derivatives : enable
//https://glslsandbox.com/e#76069.0
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
mat2 rot(float ang){
	float c = cos(ang);
	float s = sin(ang);
	return mat2(c,-s,s,c);}
void main( void ) {

	vec2 p = 6.* (2.* gl_FragCoord.xy -  resolution.xy )/ resolution.x;
	float k =1.;
	vec2 a = vec2(cos(time/4.),sin(time/4.));
	for(int i =0;i<20;i++){
		
			p.x = abs(p.x)+k/2.;
		p-=2.*a*min(0.,dot(a,p));
				p=abs(p)-vec2(k);
		p *= rot(time);

		
		
		k/=2.;
	}
		
	float color = 0.;
	color=step(dot(p,p),0.001);
	//color=exp(-1e5*dot(p,p));

	gl_FragColor = vec4(vec3(0.5-color,0,0), 1.0 );

}