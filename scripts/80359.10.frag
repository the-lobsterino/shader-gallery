#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = 3.14159;

vec3 getInsideIntensity(vec3 rgb, vec2 pos,float time,float radius){
	
	float dist = length(pos);
	float pointAngle = mod(atan(pos.y,pos.x) + pi,2.0*pi) / (2.0*pi); //Between 0;1
	
	float distTimeFactor = 1.0/6.0;		//Speed of the Ball
	float angleTimeFactor = 1.0/12.0;	//Spin  of the Ball
	
	float distEvolution = mod(time*distTimeFactor,radius*2.0); //Between 0;1 jumping back to 0 after 1
	
	if(distEvolution > radius){ 
		distEvolution = (2.0*radius) - distEvolution; //Between 0;1 Going one way then going back
	}
	distEvolution = 2.0 * (distEvolution - radius/2.0); //Between -1;1 Going one way then going back
	
	
	float arcSize = 0.05;
	float startArcAngle = mod(time*angleTimeFactor,1.0);
	float endArcAngle = startArcAngle + arcSize;
	
	/* Display Circles along the Ball
	if( distEvolution - 0.02 < dist && dist <  distEvolution){rgb = vec3(0.0,1.0,0.0);}
	if(-distEvolution - 0.02 < dist && dist < -distEvolution){rgb = vec3(1.0,0.0,0.0);}
	*/
	
	if(distEvolution -0.02 < dist  && dist < distEvolution &&(
		startArcAngle < pointAngle && pointAngle < endArcAngle|| 
		endArcAngle >1.0 && pointAngle <= endArcAngle - 1.0)
	){
		rgb = vec3(1.0,1.0,1.0);
	}
	
	float mirroredAngle = mod(0.5 + pointAngle,1.0); 
	if(-distEvolution -0.02 < dist && dist < -distEvolution &&
	   (startArcAngle < mirroredAngle && mirroredAngle < endArcAngle|| 
	    endArcAngle >1.0 && mirroredAngle <= endArcAngle - 1.0)
	){	
		rgb = vec3(1.0,1.0,1.0);	
	}
	
	return rgb;	
}

vec3 getInsideCross(vec3 rgb, vec2 pos,float time,float radius){
	
	float dist = length(pos);
	float pointAngle = mod(atan(pos.y,pos.x) + pi,2.0*pi) / (2.0*pi); //Between 0;1
	
	float arcSize = 1.0/128.0;
	float startArcAngle = mod(time/16.0,1.0/4.0) + -arcSize / 2.0;
	float endArcAngle = startArcAngle + arcSize;
	
	if(	startArcAngle < pointAngle && pointAngle < endArcAngle ||
		startArcAngle+0.25 < pointAngle && pointAngle < endArcAngle+0.25 ||
		startArcAngle+0.5 < pointAngle && pointAngle < endArcAngle+0.5 ||
		startArcAngle+0.75 < pointAngle && pointAngle < endArcAngle+0.75 ||
		startArcAngle < 0.0 && pointAngle > 1.0+startArcAngle 
	  ){
		rgb = vec3(1.0,1.0,1.0);
	}
	
	return rgb;	
}


vec3 getCircleIntensity(vec3 rgb, vec2 pos,float time){
	float pointAngle = mod(atan(pos.y,pos.x) + pi,2.0*pi) / (2.0*pi); //Between 0;1
	
	float angleTimeFactor = 8.0/27.0;
	
	float arcSize = 0.1;
	float startArcAngle = mod(0.5+time*angleTimeFactor,1.0);
	float endArcAngle = startArcAngle + arcSize;
	
	if(startArcAngle < pointAngle && pointAngle < endArcAngle || 
	   endArcAngle >1.0 && pointAngle < endArcAngle - 1.0  ){
		rgb = vec3(1.0,1.0,1.0);
	}
	return rgb;
}

vec3 getBackgroundIntensity(vec3 rgb, vec2 pos,float time,float radius){
	float dist = length(pos);
	rgb = vec3(0.0,0.0,0.0);
	rgb = rgb + dist-radius;
	return rgb;
}


void main( void ) {
	//Generate a Black/Pink grid on background (Failsafe)
	vec3 rgb =vec3(1.0,0.0,1.0);
	if(mod(gl_FragCoord.x,16.0)<8.0 ^^ mod(gl_FragCoord.y,16.0)<8.0){	rgb =vec3(0.0,0.0,0.0);}
	
	//General variables
	float alpha = 1.0;
	//alpha = 0.8;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float cosWave = (cos(time)/pi);
	float sinWave = (sin(time)/pi);
	
	//Management of the circle
	vec2 center = vec2(cosWave * 0.1 + 0.5,sinWave * 0.1 +  0.5);
	//center = vec2(0.5,0.5);
	float radius = 0.4;
	float circleEdge = 0.01;
	
	float distCenterPosition = distance(position, center);
	vec2 posFromCenter = position-center;
	
	//Set pixel intensities 
	
	rgb = getBackgroundIntensity(rgb, posFromCenter, time, radius/1.5);
	
	if(distCenterPosition < radius-circleEdge){ //Inside
		rgb = getInsideIntensity(rgb, posFromCenter,time,radius - circleEdge);
	
	}else if(distCenterPosition < radius){ //Edge
		rgb = getCircleIntensity(rgb,posFromCenter, time);
	}	
	//Final Output
	gl_FragColor = vec4( vec3( rgb.x, rgb.y, rgb.z), alpha );
}