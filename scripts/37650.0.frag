#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotateVector(vec2 vector, float alpha){
	mat2 rotMat;
	rotMat[0] = vec2(cos(alpha),-sin(alpha));
	rotMat[1] = vec2(sin(alpha), cos(alpha));
	return rotMat*vector;
}
			 
void main( void ) {
	
	vec4 color = vec4(0);
	vec2 p = ( gl_FragCoord.xy / resolution.xy )*2.0-vec2(1,1);
	//vec2 lightPos = vec2(0.5,0);
	//lightPos = rotateVector(lightPos, time);

	for(float i = 0.0; i <10.0; i++){
		float ptime =  (time - (i/3.0));
		vec2 lightPos = rotateVector(vec2(0.5+(mouse.x-0.5),0.0), ptime);
		//lightPos *= sin(pow(time/50.0,2.0))*1.4;
		lightPos *= sin(ptime/i)*1.4;
		float distance1 = length(-p + lightPos);
		
			float alpha = pow(distance1/2.4,0.1);
		if(distance1 < 2.0){
			color += mix(clamp(vec4(cos(i),sin(i),0.7,1.0)/1.4,0.0,1.0),vec4(0), alpha);
			//color += mix(vec4(p.x/5.0,p.y/5.0,0.1,1.0),vec4(0), alpha);
		}
		
	}
	gl_FragColor = color;
	


}