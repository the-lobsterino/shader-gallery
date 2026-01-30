#ifdef GL_ES
precision mediump float;
#endif

#define pi 3.141592653589793238462643383279


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 freelightColor = vec4(0.0, 0.0, 0.1, 1.0);

float freelightRadRel = 0.4;

float intenseReduce = 5.0;

const int starRays = 4;

float getReducedIntenseByAxis(vec2 fragCoordRel, vec2 mouseRel, vec2 reduceVec, float IntenseReduce)
{
	float currentCos = dot(normalize(fragCoordRel - mouseRel), 
			       normalize(reduceVec));
	
	float currentSin = sqrt(1.0 - currentCos * currentCos);
	
	return currentSin * intenseReduce;
}

float getStar(vec2 fragCoordRel, vec2 mouseRel, float IntenseReduce)
{
	float returnVal = 0.0;
	
	float singleAngle = pi/float(starRays);
	
	vec2 reduceVec = vec2(1.0, 0.0);
	
	for (int i = 1; i<=int(starRays); i++)
	{
		reduceVec.x = cos(singleAngle*float(i) + time);
		reduceVec.y = sin(singleAngle*float(i) + time);
		returnVal -= getReducedIntenseByAxis(fragCoordRel, mouseRel, reduceVec, IntenseReduce);
	}
	
	return returnVal;
}


void main( void ) {
	
	vec2 mouseRel = mouse - vec2(0.5, 0.5);
	
	vec4 bglight = vec4(0.0, 0.0, 0.1, 1.0); // bgcolor
	
	vec2 fragCoordRel = vec2(gl_FragCoord.x/resolution.x, 
				 gl_FragCoord.y/resolution.y) - vec2(0.5, 0.5);
	
	vec4 greenlight = vec4(0.0, 0.0, 0.0, 1.0);
	
	float minIntensity = mix(20.0, 0.0,
			 ((distance(fragCoordRel, mouseRel))/freelightRadRel));
	
	vec2 fragCoordRelMouse = fragCoordRel - mouseRel;
	
	//if (fragCoordRelMouse)
	
	float currentIntensity = minIntensity - 
		getReducedIntenseByAxis(fragCoordRel, mouseRel, vec2(1.0, 0.0), 5.0)
		-getReducedIntenseByAxis(fragCoordRel, mouseRel, vec2(cos(pi/float(starRays)), sin(pi/float(starRays))), 5.0)
		-getReducedIntenseByAxis(fragCoordRel, mouseRel, vec2(cos(pi/3.0), sin(pi/3.0)), 5.0);
	
	vec4 color;
	
	if (distance(fragCoordRel, mouse) < 10.0)
	{
		color = bglight + freelightColor*(minIntensity + getStar(fragCoordRel, mouseRel, 5.0));
		//color = bglight + freelightColor*currentIntensity;
	}
	else
	{
		color = bglight;
	}
		
	gl_FragColor = color;
}