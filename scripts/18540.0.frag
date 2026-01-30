#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// http://vergedure.tumblr.com
//
// Partially working raymarching
// TODO: 
//	--> fix substraction functions
//	--> add camera orientation control
//
// http://vergedure.tumblr.com


float detail=.001;

float rand(vec2 co){
	return fract( sin(dot(co.xy, vec2(12.9898, 78.233) ) ) * 43758.5453);
}

vec3 f(vec3 p){
	//return vec3(p.x, iResolution.y*0.5, p.z);
	return vec3(p.x, 0.5*sin(2.*p.x/resolution.x)*cos(2.*p.z/resolution.x)*resolution.y, p.z);	
}


float sdSphere(vec3 rayPos,vec3 spherePos, float radius){
	return length(rayPos - spherePos)/radius;
}

float udBox(vec3 boxPos, vec3 rayPos, vec3 bounds ){
  return length(max(abs(rayPos)-bounds,0.0));
}


float opS( float d1, float d2 )
{
    return max(d1,d2);
}

float opU( float d1, float d2 )
{
    return min(d1,d2);
}

float de(vec3 p) {
	if(abs(p.x)> resolution.x/2.){
	//	return 0.;
	}
	
	
	float d = (sin(time)*0.5 + 0.5)*(p.y) ;
	d = 1000.;
	vec3 sphereCenter = vec3(10., resolution.y/2., resolution.x/2.);
	d = sdSphere(p, sphereCenter,  1.);
	
	
	d = min(distance(p, f(p)), d);
	//d = min(d, p.x);
	//d = min(d, iResolution.x - p.x);
	
	//d = min(d, distance(p.z, resolution.x));
	
	return d;
}

vec3 normal(vec3 p) {
	vec3 e = vec3(0.0,detail,0.0);
	
	return normalize(vec3(
			de(p+e.yxx)-de(p-e.yxx),
			de(p+e.xyx)-de(p-e.xyx),
			de(p+e.xxy)-de(p-e.xxy)
			)
		);	
}

vec3 raymarch(vec3 camPos, vec3 pixelPos, vec3 rayDirection) 
{
	
	float rayLength = 2.*resolution.x;
	const int steps = 64;
	float hopLength = rayLength/float(steps);
	
	detail = hopLength;
	float start = 0.;//distance(vec3(0., 0., camPos.z), pixelPos)*0.02;
	vec3 offsets = rayDirection*hopLength;

	vec3 p = camPos.xyz + start*offsets;	
	int posOnRay = steps;
	float dist = 0.;
	for (int i = 0; i<steps; i++) {
		p+= offsets;
		dist = de(p);
		if (dist < detail){
			posOnRay = i;
			return p;
		}
	}
	return p;
}




float dispBar(vec3 barPos, float value, float scale){
	float width = 10.;
	float inWidth = 1.-smoothstep(  0., width, gl_FragCoord.x-barPos.x -width/2.);
	float inHeight = 1.-smoothstep(  0., scale*value, gl_FragCoord.y-barPos.y);
	
	return sign(inWidth) * sign(inHeight)/2.;
}


void main( void ) {
	float renderBegin = time;
	// Begin of working part
	vec3 pixelPos = vec3(gl_FragCoord.xy - resolution.xy/2., 0.);
	vec2 mouseToCenter = mouse - vec2(0.5, 0.5);
	vec2 mouseToCenterPX = mouseToCenter*resolution;
	vec3 distToMouse = vec3(pixelPos.x - mouseToCenterPX.x, pixelPos.y - mouseToCenterPX.y, 0.);

	
	float fov = radians((sin(time)*0.5 +0.5)*90.);
	fov = radians(90.);
	vec3 camPos = vec3(0., (sin(time)*1.+1.5)*resolution.y/2., - resolution.x/2./tan(fov/2.));
	
	vec3 rayDirection = normalize(pixelPos - vec3(0., 0., camPos.z));

	vec3 result = raymarch(camPos, pixelPos, rayDirection);
	vec3 normal = normal(result);
	float distToCam = distance(result, vec3(0., 0., camPos.z));
	
	
	
	vec3 color = abs((result -vec3(camPos.x, camPos.y, -camPos.z))/resolution.xyx);
	
	gl_FragColor = vec4(color, 1.0);
	
	// End of working part
	
	// Begin of testing part
	
	
	// End of testing part
	
	// Begin of debugging part
	vec3 barPos = vec3(15., 0., 0.);
	
	// Begin of display of variables
	if(.5 <= dispBar(0.*barPos, sin(time)*.5 +.5, 100.)){ gl_FragColor = vec4(1., 0., 0., 1.); }
	if(.5 <= dispBar(1.*barPos, cos(time)*.5 +.5, 100.)){ gl_FragColor = vec4(1., 0., 0., 1.); }
	
	
	if(abs(gl_FragCoord.y - 100.)< 1. && gl_FragCoord.x < barPos.x*3.){
		gl_FragColor = vec4(0., 1., 0., 1.);
	}
	// End of display of variables
	
	
	
	
	
	
	float axeX = 1.-smoothstep(  0., 1., abs(gl_FragCoord.x-resolution.x/2.));
	gl_FragColor += 2.*vec4(-axeX, axeX, -axeX, 1.);
	float axeY = 1.-smoothstep(  0., 1., abs(gl_FragCoord.y-resolution.y/2.));
	gl_FragColor += 2.*vec4(-axeY, axeY, -axeY, 1.);
	
	// End of debugging part
}
