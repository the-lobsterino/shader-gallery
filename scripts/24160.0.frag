
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;







#define INF  20.
#define EPSILON  0.0043543454301
#define PI  3.14159265359

#define time mod(time, 100.*PI) 

/* Begin of the lightning related  structs */
struct Lighting{
	vec3 diffuse;
	vec3 specular;
	float luminosity;
};
 
struct PointLight{
	vec3 position;
	float radius;
	float kernel;
	
	vec3 diffuseColor;
	float diffusePower;
	vec3 specularColor;
	float specularPower;
};
/* End of the lightning related  structs */

	


/* Begin of rendering functions declaration */
float map(vec3 p);


vec3 raymarch(vec3 origin, vec3 dir);
vec3 raymarch32(vec3 origin, vec3 dir);

vec3 raymarchInside(vec3 origin, vec3 dir);
vec3 raymarchInside32(vec3 origin, vec3 dir);


vec3 getNormal(vec3 p);
vec3 getColor(vec3 dir, vec3 p, vec3 normal);
vec3 getShade(vec3 dir, vec3 p, vec3 normal);
Lighting getLighting( PointLight light, vec3 p, vec3 dir, vec3 normal );
/* End of rendering functions declaration */





/* Begin of geometric/math functions declaration */
vec2 rotate(vec2 p, float angle);
float rand(vec2 n);
float noise(vec2 n);
/* End of geometric/math functions declaration */






/* Begin of volumes distance functions declaration */
float sdSphere(vec3 p, float r);
float sdBox(vec3 p, vec3 b);
float dingdong(vec3 p);
/* End of volumes distance functions declaration */





/* Begin of misc functions declaration */
vec3 hsv2rgb(vec3 c);
vec3 rgb2hsv(vec3 c);
vec3 getFromPalette(vec3 c);
/* End of misc functions declaration */


	
	
	
/* Begin of the definition of global variables */


float viewRotation = 0. ;
vec3 origin = vec3(INF*.5*cos(viewRotation), 0., INF*.5*sin(viewRotation));

PointLight light0 = PointLight( vec3(sin(time*.25)*INF*.5, INF/4., cos(time*.25)*INF*.5), INF*2., INF/32., vec3(1.0, 1.0, 1.0), 5., vec3(1., 0., 0.), 100. );
/* End of the definition of global variables */

void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy) - vec2(.5);
		
	uv.x *= resolution.x/resolution.y;
	uv.xy*=90./45.;
	
	vec3 eyeDir = normalize(vec3(uv, 1.));
	vec3 dir = eyeDir;
	dir.xz = rotate(dir.xz, viewRotation+ PI/2. );
	dir.xy = rotate(dir.xy, -.2);
	
	vec3 hit = raymarch(origin, dir);
	vec3 normal = getNormal(hit.xyz);
	
	vec3 color = getColor(dir, hit.xyz, normal);
	
	Lighting l = getLighting( light0, hit, dir, normal );
	
  	color = (color + l.diffuse + l.specular)*l.luminosity;
	color = pow(max(color, vec3(0.)), vec3(1.0 / 1.2));
	gl_FragColor = vec4(color, 1.0 );
	
	//gl_FragColor.rgb = getFromPalette(gl_FragColor.rgb);
}




vec3 raymarch(vec3 origin, vec3 dir){
	float d;
	float dist;
	for(int i = 0; i < 128; i++){
		d = map(origin);
		if(d < EPSILON){
			dist = float(i);
			break;
		}
		origin+=dir*d*.6;
	}
	return origin;
}


vec3 raymarch32(vec3 origin, vec3 dir){
	float d;
	float dist;
	for(int i = 0; i < 32; i++){
		d = map(origin);
		if(d < EPSILON){
			dist = float(i);
			break;
		}
		origin+=dir*d;
	}
	return origin;
}


vec3 getNormal(vec3 p){
  	vec3 n;
  	n.x = map(vec3(p.x+EPSILON, p.y, p.z));
  	n.y = map(vec3(p.x, p.y+EPSILON, p.z));
  	n.z = map(vec3(p.x, p.y, p.z+EPSILON));
  	return normalize(n-map(p));
}


vec3 getColor(vec3 dir, vec3 p, vec3 normal){
	vec3 color = vec3(.5)+.5*normal;
	color = vec3(0., .15, 0.5);
	
	return color;
}

Lighting getLighting( PointLight light, vec3 p, vec3 dir, vec3 normal ){
	if(distance( light.position, p) < light.kernel+ EPSILON*500.){
		//return Lighting(light0.diffuseColor, light0.specularColor, 1.);
		return Lighting(abs(normal), abs(normal), .5);
	}
	//p.x = mod(p.x, INF);
	normal = -normal;
	Lighting OUT = Lighting(vec3(0., 1., 0.), vec3(1., 0., 0.), 0.);
	
	
	float lambertian = max(dot(dir,normal), 0.0);
	float specular = 0.0;
	
	if(lambertian > 0.0) {
		
		vec3 lightDir = normalize(p-light.position );
		vec3 halfDir = normalize(lightDir + dir);
		float specularAngle = max(dot(halfDir, normal), 0.0);
		specular = pow(specularAngle, light.specularPower);
		lambertian = specularAngle;
		
		
	}
	OUT.luminosity = clamp(1.- distance(p, light.position)/light.radius, 0., 1.)*step(0., lambertian);
	OUT.diffuse = lambertian * abs(normal);//light.diffuseColor;
        OUT.specular = specular * abs(normal);//light.specularColor;
	return OUT;
}


float map(vec3 p){
	p.yz = rotate(p.yz, cos(p.x*.1-time)*.1);
	float d = -sdBox(p - vec3(0., cos(p.x-time), cos(p.x*.2-time)*5.*sign(p.z)), vec3(INF*10., INF/2., INF));
	d = min(d, sdSphere(p, INF/16.));
	d = min(d, sdSphere((p - light0.position).xzy, light0.kernel));
	
	return d;
}

float sdSphere(vec3 p, float r){
	return length(p) - r;	
}



float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
  	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

vec2 rotate(vec2 p, float angle){
	return vec2(p.x*cos(angle)-p.y*sin(angle), p.y*cos(angle)+p.x*sin(angle));
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

vec3 getFromPalette(vec3 color){
	color = clamp(color, vec3(0.), vec3(1.));
	vec3 hsv = rgb2hsv(color);
	if(mod(gl_FragCoord.x, 2.) < 1. && mod(gl_FragCoord.y, 2.) < 1.){
		hsv.r = floor(hsv.r*16.)/16.;
		hsv.g = 1.;
		//hsv.b = step(0.001, hsv.b);
		//return vec3(1., 0., 0.);
		
	}
	return hsv2rgb(vec3(hsv.r, hsv.g, hsv.b));

}	
