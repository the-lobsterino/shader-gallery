#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float Blob(vec2 position,vec2 point, float radius){
	float temp=pow(position.x-point.x,2.0) + pow(position.y-point.y,2.0);
	float result=0.0;
	result = (radius * radius) / temp;
	//if( temp<pow(radius,2.0)){		
		//float distance=sqrt(pow(position.x-point.x,2.0)+pow(position.y-point.y,2.0))/radius;		
		//result=pow((1.0-pow(distance,2.0)),2.0);		
	//}
	return result;
}
void main( void ) {
	float PI=3.141516;
	vec2 position =  gl_FragCoord.xy / resolution.xy ;
	vec2 pointA= vec2(0.00,0.5),pointB= vec2(1,0.5);
	vec2 mousePosition = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float radius=0.1;

	float blobValue=0.0;
	blobValue+=Blob(position,pointA,radius);
	blobValue+=Blob(position,pointB,radius);
	blobValue+=Blob(position,mouse,radius);
	
	
	
	vec4 color=vec4(blobValue,blobValue,blobValue,1.0);
	color=floor(color);
	gl_FragColor = color;

}
