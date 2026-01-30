#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

float pulse(float time, float frequency)
{
const float pi = 3.14;
return 0.5*(1.0 + sin(2.0 * pi * frequency * time));
}

vec2 vectorsToDraw[3];
vec2 vector1 = vec2(3.0, 7.0);
vec2 vector2 = vec2(10.0, 10.0);
vec2 vector3 = vec2(-10.0, -3.0);

//basic vectors defining a single grid unit
vec2 ihat = vec2(40.0,0.0);
vec2 jhat = vec2(0.0,40.0);
vec2 origin = vec2(0.0);

//thickness of each gridLine, should be smaller that gridUnits
float gridLineThickness = 0.05;
//thickness of gridAxis, only active if bigger than gridLineThickness
float gridAxisThickness = 0.08;
//the radius of the origin point of grid
float originPointRadius = 0.2;
// the grids color
vec3 gridColor = vec3(0.0);
//coords: pixel coordinates of current point
//returns 0 if not on grid, 1 if on grid
float onGrid(vec2 coords){
	
	vec2 trianglePoint = origin;
	float param2
	= ((ihat.x*(trianglePoint.y-coords.y))
	+(ihat.y*(coords.x-trianglePoint.x)))
	/
	((jhat.x*ihat.y)
	-(jhat.y*ihat.x));
	float param1
	= (-param2 * jhat.x
	+ coords.x - trianglePoint.x)
	/ (ihat.x);
	
	float originPoint =
	step(length(vec2(param1,param2)), originPointRadius);
	float gridAxis =
	step(abs(param1), gridAxisThickness)
	+ step(abs(param2), gridAxisThickness);
	float gridLine =
	step(mod(abs(param1), 1.0), gridLineThickness)
	+ step(mod(abs(param2), 1.0), gridLineThickness);
	return
	mix(
	0.0,
	1.0,
	gridLine + gridAxis + originPoint
	);
	}
	
	float onVector(vec2 coords, vec2 vector){
		vec2 scaledVector = vector.x * ihat + vector.y * jhat;
	
		float param1 = coords.x / scaledVector.x;
		float param2 = coords.y / scaledVector.y;
		float onVector =
		step(abs(param1-param2), .3 / length(vector))
		- step(1.0, param1)
		- step(param1, 0.0)
		;
		return
		mix(
		0.0,
		1.0,
		onVector);
}

void main(void) {
float minRes = min(resolution.x, resolution.y);
vec2 uv = gl_FragCoord.xy - resolution.xy * 0.5;
uv /= minRes *0.5;

ihat.y = mix(-100.0, 100.0, pulse(time, 0.1));
jhat.x = mix(-100.0, 100.0, pulse(time, 0.1));


vectorsToDraw[0] = vector1;
vectorsToDraw[1] = vector2;
vectorsToDraw[2] = vector3;

vec3 color = vec3(1.0);

float onVector = onVector(uv * minRes, vector1);
mix(0.0,1.0,onVector);
color = //vec3(onVector);
color * (1.0 - onVector)
+ vec3(1.0,0.0,0.0) * onVector;

	/*
onVector = onVector(uv * minRes, vector2);
mix(0.0,1.0,onVector);
color = //vec3(onVector);
color * (1.0 - onVector)
+ vec3(1.0,0.0,0.0) * onVector;

onVector = onVector(uv * minRes, vector3);
mix(0.0,1.0,onVector);
color = //vec3(onVector);
color * (1.0 - onVector)
+ vec3(1.0,0.0,0.0) * onVector;
*/
	
float onGrid = onGrid(uv * minRes);
color =
color * (1.0 - onGrid)
+ gridColor * onGrid;

gl_FragColor = vec4(color, 1.0);
}