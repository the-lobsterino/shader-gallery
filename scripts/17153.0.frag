#ifdef GL_ES
precision mediump float;
#endif
//I am NOT the maker of this shader;
//I simply turn the ovals to circles.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float MetaBall(vec2 position){
	return 2.0/(pow(position.x,1.0)+pow(position.y,1.0));
}
float Blob(vec2 position,vec2 point, float radius){
	
float temp=pow(position.x-point.x,2.0)+pow(position.y-point.y,2.0);
	float result=0.0;
	if( temp<pow(radius,2.0)){		
		float distance=sqrt(pow(position.x-point.x,2.0)+pow(position.y-point.y,2.))/radius;		
		result=pow((1.0-pow(distance,1.)),2.0);		
	}
	return result;
}
void main( void ) {
	float PI=3.141516;
	vec2 position =  gl_FragCoord.xy / resolution.x ;
	vec2 pointA= vec2(0.35,0.25),pointB= vec2(0.65,0.25);
	vec2 mousePosition = ( gl_FragCoord.xy / resolution.xy ) + mouse;
	float radius=0.050;

	float blobValue=0.0;
	blobValue+=Blob(position,pointA,radius);
	blobValue+=Blob(position,pointB,radius);
	blobValue+=Blob(position,mouse*vec2(1.0,0.5),radius);
	
	
	
	vec4 color=vec4(blobValue,blobValue/2.0,0.0,1.0);
	color=floor(color/0.1)*0.2;
	gl_FragColor = color;

}
