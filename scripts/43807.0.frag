// @VRG_corp, wow c'est l'abus


#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define time mod(time, 1000.*pi)

const float epsilon = 0.5*0.043543454301;
const float pi = 3.14159265359;
const float inf = 1e10;

const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float sphereSize = 100.;
float rotSpeed = .1;

float rotDist = sphereSize*2.;

vec3 eye = vec3(cos(time*rotSpeed)*rotDist, 0., sin(time*rotSpeed)*rotDist);

float xrot = 0.;
float yrot = -time*rotSpeed - pi/2.;
float zrot = 0.;

mat3 rotationMatrix(vec3 axis, float angle){
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat3(
		oc * axis.x * axis.x + c,          	oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
		oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
		oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c
	);
}

vec3 rotate_x(float theta, vec3 v) {
	float ct = cos(theta), st = sin(theta);
	return v * mat3(1.0, 0.0, 0.0, 0.0, ct,  -st, 0.0, st,  ct );
}

vec3 rotate_y(float theta, vec3 v) {
	float ct = cos(theta), st = sin(theta);
	return v * mat3(ct,  0.0, st,  0.0, 1.0, 0.0, -st, 0.0, ct );
}

vec3 rotate_z(float theta, vec3 v) {
	float ct = cos(theta), st = sin(theta);
	return v * mat3(ct,  -st, 0.0, st,  ct,  0.0, 0.0, 0.0, 1.0);
}

float noise( in vec2 x ){
	return sin(1.5*x.x)*sin(1.5*x.y);
}

float noise( in vec3 x ){
	return sin(1.5*x.x)*sin(1.5*x.y)*sin(1.5*x.z);
}

float fbm4( vec2 p ){
    float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}
float fbm4( vec3 p ){
    return fbm4(p.xy)*fbm4(p.yz);
}
float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}
float smin( float a, float b, float k ){
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}
float opU( float d1, float d2 ){
    return min(d1,d2);
}
vec3 opRep( vec3 p, vec3 c ){
    vec3 q = mod(p,c)-0.5*c;
    return  q ;
}
vec3 opCRep( vec3 p, vec3 c ){
    vec3 q = mod(p+0.5*c, c)-0.5*c;
    return  q ;
}
float shade(vec3 p, vec3 normalValue, vec3 lightPosition, float raysLength){
	vec3 lightDirection = normalize(lightPosition - p);
	float lightIntensity = ((raysLength - distance(lightPosition, p))/(raysLength));
	return (1.-clamp((radians(180.)-asin(dot(normalValue, lightDirection)))/radians(180.), 0., 1.)) * lightIntensity;	
}
float seaHeight(vec3 p){
	return 0.;
}
float groundHeight(vec3 p){
	p/=sphereSize/30.;
	return exp(fbm4(p))+2.*fbm4(p/10.)*sphereSize/10.;
}
float ground;
float sea;
float centerHeight = 0.;
float insideBox;
float distanceField(vec3 p){
	vec3 oldP = p;
	vec3 normP = normalize(p);
	sea = seaHeight(p);
	ground = groundHeight(p);
	float d = length(p)-sphereSize;
	d = length(p )-sphereSize + ground;
	return d;
}
bool postProcessEnabled=true;
bool light=false;
vec3 pointColor(vec3 p, vec3 normalValue, vec3 rd, float dist){
	light = true;
	if(length(p) <= sphereSize ){
		return vec3(.1, .3, .8)*(ground-.5);
	} else if(length(p) <= sphereSize*2.){
		float altitude = 1.3 -ground/2.;
		return vec3(altitude);
	}
	return vec3(0.);
}
vec3 normal(vec3 p) {
	vec3 e = vec3(0.0,epsilon,0.0);
	return normalize(vec3(
			distanceField(p+e.yxx)-distanceField(p-e.yxx),
			distanceField(p+e.xyx)-distanceField(p-e.xyx),
			distanceField(p+e.xxy)-distanceField(p-e.xxy)
			)
		);
}
vec4 raymarch(vec3 rayOrigin, vec3 rayDirection){
	float t = 0.0;
	const int maxSteps = 64;
	vec3 p;
	float dist2Eye = 1.;
	float d = 0.;
	for(int i = 0; i < maxSteps; i++) {
		p = rayOrigin + rayDirection * t;
		d = distanceField(p);
		if(d < epsilon){
			return vec4(p, float(i)/float(maxSteps));
		}
		t += d;
	}
	return vec4(p, 0.);
}
vec4 lastResult;
vec3 lastNormal;
vec3 castRay(vec3 ro, vec3 rd){
	lastResult = raymarch(ro, rd);
	lastNormal = normal(lastResult.xyz);
	return pointColor(lastResult.xyz, lastNormal, rd, lastResult.w);
}
vec3 postProcess(vec3 color){
	if(light){
		float colorIntensity = clamp(shade(lastResult.xyz, lastNormal, eye, 1000.),0., 1.);
		color = mix(color, vec3(1.,  .8, .2), .125);
		color = mix(vec3(0.), color, .1 + .9*colorIntensity);
	}
	return pow(clamp(color, 0., 100.), vec3(1.0 / 2.2));
}
void main(){
	vec2 uv = 2.*gl_FragCoord.xy/resolution.xx-vec2(1., resolution.y/resolution.x);
	uv*=.5*resolution.x/resolution.y;
	float up = 1.;
	float right = 1.;
	float forward = 1./2.;
	vec3 ro = eye + vec3( right * uv.x, up * uv.y, - forward);
	vec3 rd = normalize(vec3(uv.x, uv.y, forward));
	rd = rotate_x(xrot, rd);
	rd = rotate_y(yrot, rd);
	rd = rotate_z(zrot, rd);
	vec3 color = castRay(ro, rd);
	vec3 fogColor = .25*vec3(max(1.-.5*distance(uv, vec2(sin(time), cos(time))), 1.-.5*distance(uv, vec2(sin(time+pi), cos(time+pi)))) , 1.-.5*distance(uv, vec2(cos(time+pi/2.), sin(time+pi/2.))), 1.-.5*distance(uv, vec2(cos(time-pi/2.), sin(time-pi/2.))));
	color = color;
	if(postProcessEnabled){
		gl_FragColor = vec4(postProcess(color), 1.);
	} else {
		gl_FragColor = vec4(color, 1.);
	}
}
