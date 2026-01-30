/*
To JMI, a teacher that has marked our life and that we will never forget

Thank you for all the good courses that you gave us
Thank you for trying to help those who struggle
Thank you for all the things that you've organized for 
Thank you for all the good moment that you shared with us
Thank you for the attention that you gave to each of us

Things won't be the same anymore,
I don't know what to do,
I don't even realize what is happening


*/



#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



const float EPSILON = 0.0043543454301;
const float PI = 3.14159265359;

float demoTime = time*.1;


/* Begin of rendering functions declaration */
float map(vec3 p);


vec3 raymarch(vec3 origin, vec3 dir);



vec4 getNormal(vec3 p);
vec3 getColor(vec3 dir, vec3 p, vec4 normal);
vec3 postProcess(vec3 color);
/* End of rendering functions declaration */





/* Begin of geometric/math functions declaration */
vec2 rotate(vec2 p, float angle);
vec3 rotate(vec3 p, vec3 angle);
/* End of geometric/math functions declaration */






/* Begin of volumes distance functions declaration */
/* End of volumes distance functions declaration */





/* Begin of misc functions declaration */
vec3 hsv2rgb(vec3 c);
vec3 rgb2hsv(vec3 c);
/* End of misc functions declaration */


	
	
	
/* Begin of the definition of global variables */


vec3 viewRotation = vec3(PI/7., 0., 0.) ;
vec3 origin = vec3(0. , 10., -20.0);


float backgroundShift = time*.05;
/* End of the definition of global variables */

void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy) - vec2(.5);
		
	uv.x *= resolution.x/resolution.y;
	
	uv.xy*=90./45.;
	
	vec3 eyeDir = normalize(vec3(uv, 1.));
	vec3 dir = rotate(eyeDir, viewRotation);
	
	vec3 hit = raymarch(origin, dir);
	vec4 normal = getNormal(hit.xyz);
	float edge = normal.w;
	vec3 color = getColor(dir, hit.xyz, normal);
	
	color = pow(max(color, vec3(0.)), vec3(1.0 / 1.2));
	gl_FragColor = vec4(color, 1.0 );
	
	//gl_FragColor.rgb = getFromPalette(gl_FragColor.rgb);
}


float steps = 0.;
#define alt_marching
vec3 raymarch(vec3 origin, vec3 dir){
	vec3 p = origin;
	float pixelRadius = EPSILON;
	float d;
	float last_d = 0.;
	float best_d = 100.;
	vec3 best_origin = origin; 
	float current_k = 1.6;
	steps = 0.;
	for(int i = 0; i < 48; i++){
		d = map(p);
		#ifdef alt_marching
		if(last_d*current_k>last_d+d){ // Circles don't overlap
			p-=dir*last_d*.6;
			current_k = 1.;
		} else {
			last_d = d;
			p+=dir*d*current_k;
			if(d < pixelRadius){
				break;
			}
		}
		#else
		p+=dir*d*.6;
		
		if( d < pixelRadius){
			break;
		}
		#endif
		steps++;
		
		pixelRadius = distance(origin, p)*EPSILON*.5/resolution.x;
	}
	steps/=float(64);
	return p;
}



vec4 getNormal(vec3 p){
  	vec3 e = vec3(0.0,EPSILON*5.,0.0);

	float d1=map(p-e.yxx),d2=map(p+e.yxx);
	float d3=map(p-e.xyx),d4=map(p+e.xyx);
	float d5=map(p-e.xxy),d6=map(p+e.xxy);
	float d=map(p);
	float edge=abs(d-0.5*(d2+d1))+abs(d-0.5*(d4+d3))+abs(d-0.5*(d6+d5));//edge finder
	edge=min(1.,pow(edge,.5)*15.);
	return vec4(normalize(vec3(d1-d2,d3-d4,d5-d6)), edge);
}



vec3 getColor(vec3 dir, vec3 p, vec4 normal){
	vec3 color = vec3(0.);
	if(length(p) < 30.){
		float shade = distance(origin, p)/200.+steps*.5;
		color = hsv2rgb(vec3(length(p)/10.-backgroundShift, 1., 1.));
		//vec3 color = vec3(.5)+.5*normal.rgb;
		//vec3 color = vec3(1.);
		color*=1.-shade;
		//color*=clamp(1.-normal.w, 0., 1.);
	}
	color = postProcess(color);
	
	return color;
}

vec3 postProcess(vec3 color){
	
	vec2 uv = gl_FragCoord.xy/resolution.xy - vec2(.5);
	uv.x*=resolution.x/resolution.y;

	color = vec3(cos(uv.y*resolution.y*2.*PI/3.-demoTime*5.))*.10+.90*color;
	
	return color;
}
float halfBubble(vec3 p, float size, float border){
	return max(max(length(p)- size, p.y), -length(p)+ size-border);
}

float ring(vec3 p, float size, float border, float thickness){
	return max(max(length(p.xz)- size, abs(p.y)-thickness), -length(p.xz)+ size-border);
}

////////////////////////////
float map(vec3 p){
	const float ringsAngle = PI/2.;
	vec3 ringsRotation = rotate(p, vec3(cos(ringsAngle)*-.125, 0.,sin(ringsAngle)*-.125)*PI);
	float centerAngle = demoTime*.2;
	float d = -length(p)+35.;
	d = min(d, length(p)-1.);
	d = min(d, halfBubble(rotate(p, vec3(centerAngle+cos(demoTime*1.)*.125, 0.,centerAngle+sin(demoTime*1.)*.125)*PI), 6., .5));
	d = min(d, halfBubble(rotate(p, vec3(centerAngle+cos(demoTime*2.)*.125, 0.,centerAngle+sin(demoTime*2.)*.125)*PI), 5., .5));
	d = min(d, halfBubble(rotate(p, vec3(centerAngle+cos(demoTime*3.)*.125, 0.,centerAngle+sin(demoTime*3.)*.125)*PI), 4., .5));
	d = min(d, halfBubble(rotate(p, vec3(centerAngle+cos(demoTime*4.)*.125, 0.,centerAngle+sin(demoTime*4.)*.125)*PI), 3., .5));
	d = min(d, halfBubble(rotate(p, vec3(centerAngle+cos(demoTime*5.)*.125, 0.,centerAngle+sin(demoTime*5.)*.125)*PI), 2., .5));
	
	
	d = min(d, ring(ringsRotation, 14., .25, .1));
	d = min(d, length(ringsRotation-rotate(vec3(14., 0., 0.), vec3(0., demoTime*.2, 0.)))- 1.);
	
	d = min(d, ring(ringsRotation, 18., .25, .1));
	d = min(d, length(ringsRotation-rotate(vec3(18., 0., 0.), vec3(0., demoTime*.15, 0.)))- 1.);
	
	d = min(d, ring(ringsRotation, 22., .25, .1));
	d = min(d, length(ringsRotation-rotate(vec3(22., 0., 0.), vec3(0., demoTime*.10, 0.)))- 1.);
	
	d = min(d, ring(ringsRotation, 26., .25, .1));
	d = min(d, length(ringsRotation-rotate(vec3(26., 0., 0.), vec3(0., demoTime*.5, 0.)))- 1.);
	
	return d;
}
////////////////////////////




float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
  	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdCapsule( vec3 p, vec3 a, vec3 b, float r ){
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

float sUnion(float a, float b){
	float d = exp(-4.*a) + exp(-4.*b);
	return -log(d)/4.;
}

float unionV2(float d1, float d2, float r){
	return min(length(vec2(d1, d2))-r*cos(atan(d1, d2)), min(d1, d2));
}

vec2 rotate(vec2 p, float angle){
	return vec2(p.x*cos(angle)-p.y*sin(angle), p.y*cos(angle)+p.x*sin(angle));
}

vec3 rotate(vec3 p, vec3 angle){
	p.yz = rotate(p.yz, angle.x);
	p.xz = rotate(p.xz, angle.y);
	p.xy = rotate(p.xy, angle.z);
	return p;
}



float rand(vec2 n){
    return fract(sin(n.x + n.y * 1e3) * 1e5);    
}

float rand(vec3 n){
    return fract(sin(n.x + n.y * 1e3 + n.z * 1e4) * 1e5); 
}


// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 rgb2hsv(vec3 c){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

