#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float getAngleDegree(vec2, vec2);
vec2 rotatedPoint(vec2 ,float, float);

void main( void ) {
	vec2 position = gl_FragCoord.xy/ resolution.y;
	vec2 v1 = vec2(.9, .5);
	
	//vec2 v2 = vec2(v1.x+.3*cos(time), v1.y+.3*sin(time));
	//vec2 v2 = vec2(1., .5);
	//vec2 v1 = rotatedPoint(v2, .3, (mod(-time*20., 360.)));
	vec2 v2 = rotatedPoint(v1, .3, (mod(-time*20., 360.)));
	
	float lineLength = length(v2-v1);
	vec2 lineVec = normalize(v2-v1);
	vec2 distVec = normalize(position - v1);
	float dotVal = dot(lineVec, distVec);
	float angle = acos(dotVal);
	float lineAng = getAngleDegree(v1, v2);
	
	float tAng = acos(dot(normalize(position - v1), lineVec));
	float dist = length(position-v1)*cos(tAng);//length(position - v1);
	//float dist = dot(lineVec, normalize(position - v1));
	vec2 tPoint = rotatedPoint(v1, dist, lineAng);
	float lineWidth = .007;
	if(length(position - tPoint)>lineWidth) {
		discard;
	}
	dist = length(position-v1);
	if(dist>lineLength) {
		discard;
	}
	dist = length(position-v2);
	if(dist>lineLength) {
		discard;
	}
	
	
	 
	
	gl_FragColor.g = (length(position - tPoint))*250.;
	
	
	

}

float RAD = 3.14/180.;
float DEG = 180./3.14;
vec2 rotatedPoint(vec2 point, float distance, float angleDeg){  //point needs to allocated by caller
	vec2 t;
	t.x = point.x+distance*cos(angleDeg*RAD);
	t.y = point.y+distance*sin(angleDeg*RAD);
	
	return t;
}

float getAngleDegree(vec2 v1, vec2 v2){
		float tempRad= sqrt((v2.x-v1.x)*(v2.x-v1.x)+(v2.y-v1.y)*(v2.y-v1.y));
	float tempAngle;
		if(tempRad!=0.){
			tempAngle = acos((v2.x-v1.x)/tempRad);
		}
		if(v2.y<v1.y){
			tempAngle*=-1.;
		}
		tempAngle*=DEG;
		if(tempAngle<0.){
			tempAngle+=360.;
		}
		if(tempRad==0.){
			return 0.;
		}
		return tempAngle;

	}