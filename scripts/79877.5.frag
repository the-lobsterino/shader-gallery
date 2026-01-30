#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 res(vec2 z,vec2 c);
vec3 isInSet(vec2 pos);

void main( void ) {

	

	gl_FragColor = vec4(isInSet(gl_FragCoord.xy*2.0/resolution.y-vec2(2.3,1.0)), 1.0 );
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);


}
vec2 res(vec2 z,vec2 c){
return vec2(z.x*z.x - z.y*z.y + c.x, 2.0 * z.x * z.y + c.y);
}


vec3 isInSet(vec2 pos)
{	

	vec2 c = pos;

	vec2 zn = res(pos,c);
	
	float s = 64.0;
	for(int j = 0;j<int(128);j+=1)
	{
		 zn = res(zn,c);
		 if(zn.x*zn.x+zn.y*zn.y > 4.0)
			 return vec3(float(j)/s/2.0,float(j)/s/5.0,1.0-float(j)/s);
			 //return vec3(1.0, 1.0, 1.0);
			
 
	}
	return vec3(0.0,0.0,0.0);


	
}