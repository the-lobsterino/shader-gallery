
#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float Blob(vec2 position,vec2 point, float radius){
 	float screen_prop = resolution.x / resolution.y;
// 	float temp=pow(position.x-point.x,2.0) + pow(position.y-point.y,2.0)/screen_prop;
	position -= point;
	float temp=dot(position,position)/screen_prop;
 	float result = (radius * radius) / (temp);
 	return result;
}



void main( void ) {
 	float PI=3.141516;
 	vec2 position =  gl_FragCoord.xy / resolution.xy;
	float screen_prop = resolution.x / resolution.y;
 	vec2 pointA= vec2(0.6,0.6);
 	vec2 pointB= vec2(sin(time)*0.2+0.5,cos(time)*0.2+0.5);
 	vec2 pointC= vec2(sin(time * 1.1) * 0.2 + 0.5, cos(-time*1.2) * 0.2 + 0.5);
 	float radius=0.1;
 
 	float blobValue=0.0;
 	blobValue+=Blob(position,pointA,radius);
 	blobValue+=Blob(position,pointB,radius);
	blobValue+=Blob(position,pointC,radius);
 	blobValue+=Blob(position,mouse,radius);
 
 	float blobmask = step(1.0,blobValue); //(blobValue > 1.0)? 1.0 : 0.0 ;
 	float pindoll = sqrt( -1.0 / blobValue + 1.0 ); //pow(-1.0/ blobValue+1.0, 0.5); 
 	float pin_value = sqrt(1.0-pindoll); //,0.5); 
 	vec2 uv = gl_FragCoord.xy/ resolution.xy ;
 	vec2 new_uv =normalize((uv * 2.0 -1.0 )- (mouse * 2.0 - 1.0))*((Blob(position,mouse,radius)))*pin_value*pin_value;
 	new_uv += normalize((uv * 2.0 -1.0 )- (pointA * 2.0 - 1.0))*((Blob(position,pointA,radius)))*pin_value*pin_value;
 	new_uv += normalize((uv * 2.0 -1.0 )- (pointB * 2.0 - 1.0))*((Blob(position,pointB,radius)))*pin_value*pin_value;
 
 
 	vec3 test = normalize(vec3(0.5,1.0,1.0));
 	vec3 test2 = normalize(vec3(-1.0,-1.0,0.1));

 	vec3 test3= (vec3((new_uv)*pin_value,pindoll));
 
 	float new_l = max(dot(test3, test),0.0);
 	float new_2 = max(dot(test3, test2),0.0)*0.5;
 	vec4 color=vec4((new_uv.xy)*pin_value,(blobValue),1.0)*blobmask* 0.5 + 0.5; 
 	gl_FragColor = color;
 	gl_FragColor = vec4(new_l*1.1,new_l*1.2,new_l+new_2,1.0);
}
