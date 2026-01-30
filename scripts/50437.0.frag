#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//finding point between pointA and pointB so
//that vector from current point pos to that point
//is normal to vector from pointA to pointB
// using a kind of raytracing algorithm
vec2 getPointOnAB(vec2 pointA, vec2 pointB, vec2 pos, out bool ok){
	
	vec2 nAB=normalize(pointB-pointA);
	vec2 p=pointA;
	float t=distance(pointB, pointA)/100.0;
	ok=false;
	
	for(int i=0;i<100;i++){
		vec2 fromPosToP=normalize(p-pos);
		float x=acos(dot(fromPosToP, nAB));
		if(abs(x)<0.0321){
			ok=true;
			break;
		}
		p+=t*nAB;
		
	}
	
	return p;

}

//drawing line between A and B
void main( void ) {

	vec2 pos=(gl_FragCoord.xy/resolution.xy)*2.0-1.0;
	pos.x*=(resolution.x/resolution.y);
	
	vec2 A=vec2(-0.2, -0.7);
	vec2 B=vec2(0.4, 0.5);
	bool ok;
	vec2 p=getPointOnAB(A, B, pos, ok);
	
	
	float col=0.0;
	
	if(ok){
		float dis=distance(p,pos);
		
		if(dis<0.1){
			col=1.0;
		}
	}
	
	//col=0.0;
	
	
	vec3 color=vec3(col);
	
	gl_FragColor=vec4(color, 1.0);

}



/*




*/