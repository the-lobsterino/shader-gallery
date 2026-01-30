#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 mouse;
uniform vec2 resolution;

float Blob(vec2 position,vec2 point, float radius){
	float temp=pow(position.x-point.x,2.0)+pow(position.y-point.y,2.0);
	float result=0.0;
	if( temp<pow(radius,2.0)){		
		float distance=sqrt(pow(position.x-point.x,2.0)+pow(position.y-point.y,2.0))/radius;		
		result=pow((1.0-pow(distance,2.0)),2.0);		
	}
	return result;
}
void main( void ) {

	vec2 position =  gl_FragCoord.xy / resolution.xy ;
	vec2 pointA= vec2(0.35,0.5),pointB= vec2(0.65,0.5);
	vec2 mousePosition = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float radius=0.2;

	float blobValue=0.0;
	blobValue+=Blob(position,pointA,radius);
	blobValue+=Blob(position,pointB,radius);
	blobValue+=Blob(position,mouse,radius);
	
	
	
	vec4 color=vec4(blobValue);
	color=floor(color*5.0);
	gl_FragColor = color;

}
