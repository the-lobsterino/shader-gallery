// http://monsquaz.org/

// Start settings
#define BALL_SIZE 0.15
#define LENGTH 0.3
#define WIDTH 0.1
// End settings

#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

#define MAX_DISTANCE 10.0
#define EPSILON 0.01

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
	// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
    	vec3 pa = p - a, ba = b - a;
    	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    	return length( pa - ba*h ) - r;
}

float sphere(vec3 pos, float size) {
	return length(pos) - size;	
}

vec3 translateAndWrap(vec3 worldPosition, vec3 translation) {
	return fract(worldPosition - translation) * 2.0 - 1.0;
}

float map(vec3 worldPosition) {
	vec3 centerPos = translateAndWrap(worldPosition, vec3(.0));
	vec3 ball1pos = translateAndWrap(worldPosition, vec3(BALL_SIZE/2.0, -LENGTH/2.0, .0));
	vec3 ball2pos = translateAndWrap(worldPosition, vec3(-BALL_SIZE/2.0, -LENGTH/2.0, .0));
	
	float shaft = sdCapsule(centerPos, vec3(.0, -LENGTH, .0), vec3(.0, LENGTH, .0), WIDTH);
	float balls = min(sphere(ball1pos, BALL_SIZE), sphere(ball2pos, BALL_SIZE));
	return min(shaft, balls);
}

vec3 getSurfaceNormal(vec3 p) {
	const float d = 0.01;
	return normalize(
		vec3(
			map(p+vec3(  d,0.0,0.0)) - map(p+vec3( -d,0.0,0.0)),
			map(p+vec3(0.0,  d,0.0)) - map(p+vec3(0.0, -d,0.0)),
			map(p+vec3(0.0,0.0,  d)) - map(p+vec3(0.0,0.0, -d))
		)
	);
}

struct TraceResult {
	float totalDistance;
	float surfaceDistance;
	vec3 endPosition;
};

TraceResult traceRay(vec3 origin, vec3 direction) {
	float totalDistance;
	float surfaceDistance;
	vec3 pos;
	
	for(int i=0; i<32; i++) {
		pos = origin + direction * totalDistance;
		surfaceDistance = map(pos);
		totalDistance += surfaceDistance * 0.5;
		if(totalDistance > MAX_DISTANCE || surfaceDistance < EPSILON) {
			break;	
		}
	}
	return TraceResult(totalDistance, surfaceDistance, pos);
}

vec3 getLightPosition(vec3 cameraPosition) {
	vec2 mouseNorm = mouse * 2.0 - 1.0;
	return vec3(cameraPosition.xy + mouseNorm*2.0, cameraPosition.z);
}

vec3 getColor(vec3 cameraPosition, TraceResult traceResult) {
	float fog = 1.0 / (1.0 + traceResult.totalDistance * traceResult.totalDistance * 0.15);
	
	vec3 surfaceNormal = getSurfaceNormal(traceResult.endPosition);
	
	vec3 lightPosition = getLightPosition(cameraPosition);
	vec3 lightDirection = normalize(lightPosition-traceResult.endPosition);
	
	vec3 lightReflection = reflect(-lightDirection, surfaceNormal);
	vec3 cameraDirection = normalize(cameraPosition - traceResult.endPosition);
	float specularFactor = max(0.0, dot(cameraDirection, lightReflection));
	
	float ambient = 0.1;
	float diffuse = max(0.0, dot(surfaceNormal, lightDirection));
	float specular = 0.7 * pow(specularFactor, 16.0);
	
	vec3 lightColor = vec3(1.0, 0.78, 0.54);
	
	return fog*(ambient+diffuse+specular)*lightColor;
}

void main( void ) {

	vec2 screenPosition = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	screenPosition.x *= resolution.x/resolution.y;
	
	float amplitude = 0.3;
	float rotSpeed = 0.5;
	float cosVal = amplitude*cos(time*rotSpeed);
	float sinVal = amplitude*sin(time*rotSpeed);
	
	vec3 cameraPosition = vec3(
		cosVal,
		-sinVal+time*0.3,
		time
	);
	
	screenPosition.x += cosVal;
	screenPosition.y += -sinVal;
	
	vec3 direction = normalize(vec3(screenPosition, 1.0));
	
	TraceResult traceResult = traceRay(cameraPosition, direction);
	
	vec3 color = traceResult.surfaceDistance < EPSILON ?
		getColor(cameraPosition, traceResult) : vec3(0.0);
	
	gl_FragColor = vec4( color, 1.0 );

}