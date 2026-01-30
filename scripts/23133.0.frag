#ifdef GL_ES
precision mediump float;
#endif

////////////////////////////////
//          VRG corp	      //
//            Wow,	      //
//       Ma qué caramba       //
////////////////////////////////

/////////////////////////////////////////////////////
//   https://www.youtube.com/watch?v=tchJ2vHz_nM   //
/////////////////////////////////////////////////////

// TODO: Optimize :*

// Notes: 	Hiding the code makes the animation run faster
//		Please use a definition of 1 :*
//floting hou_____-- moving housees

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define INF	2000.
#define EPSILON	0.043543454301
//#define EPSILON	0.5*0.043543454301
#define PI	3.14159265359

/* Begin of the definition of global variables */
float daytime = time/4.;
/* End of the definition of global variables */

/* Begin of rendering functions declaration */
float map(vec3 p);
vec3 raymarch(vec3 origin, vec3 dir);
vec3 getNormal(vec3 p);
vec3 getColor(vec3 lightDir, vec3 p, vec3 normal);
float getLight(vec3 lightDir, vec3 p, vec3 normal);
float getAmbiantOcclusion(vec3 p, vec3 normal);
/* End of rendering functions declaration */



const vec3 lightPos = vec3(0., 200., 0.);
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )*2. ;
	position.x -=1.;
	position.y -=1.;
	if(abs(position.x) > .35 || abs(position.y) > .5*16./9.){
		gl_FragColor = vec4(1.-1.1*length(position*resolution/resolution.xx)); 
		gl_FragColor.rb*=.75+.25*sin(gl_FragCoord.y-time*10.);
		gl_FragColor*=.75;
		
		return;
	}
	position+=vec2(.5);
	vec2 uv = position - vec2(.5);
	uv.y*= resolution.y/resolution.x;
	uv*=2.;
	
	vec3 origin = vec3(0., 30., -100.);
	
	vec3 dir = normalize(vec3(uv, 1.));
	dir.z-=(length(uv) * (0.915));
	
	vec3 hit = raymarch(origin, dir);
	vec3 normal = getNormal(hit.xyz);
	vec3 color = getColor(dir, hit.xyz, normal);
	float light = getLight(lightPos, hit.xyz, normal);
	float ao = getAmbiantOcclusion(hit.xyz, normal);
	color*=ao*light;
	//color = vec3(ao);
	color = pow(max(color, vec3(0.)), vec3(1.0 / 1.2));
	gl_FragColor = vec4(color, 1.0 );

}




vec3 raymarch(vec3 origin, vec3 dir){
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
		return .5*normal + vec3(.75+.25*cos(p.x*10.));
}


/*
float getLight(vec3 lightPos, vec3 p, vec3 normal){
	vec3 dir = (lightPos - p)/6.;
	return ((map(p + 0.*dir)+map(p + 1.*dir)+map(p + 2.*dir)+map(p + 3.*dir)+map(p + 4.*dir)+map(p + 5.*dir))/6.)/length(dir);
}
*/

float getLight(vec3 lightPos, vec3 p, vec3 normal){
	
	return 1.-.75*distance(lightPos, p)/INF ;
}

float getAmbiantOcclusion(vec3 p, vec3 normal){
	//return 1.;
	float ao = 0.;
	for(float n = 0.; n < 5.; n++){
		ao+=(n-map(p))/pow(2., n);
		p+=normal;
	}
	return 1. - ao;
}




/* Begin of volumes distance functions declaration */
float sdSphere(vec3 p, float r);
float sdBox(vec3 p, vec3 b);
/* End of volumes distance functions declaration */

/* Begin of objects distance functions declaration */
float window(float d, vec3 p, float size);
/* End of objects distance functions declaration */



/* Begin of transform functions declaration */
vec3 opCRep(vec3 p, vec3 rep, vec3 size);
/* End of transform functions declaration */


/* Begin of scenes distance functions declaration */
float bat1(vec3 p);
float bat2(vec3 p);
float bat3(vec3 p);
float other(vec3 p);
/* End of scenes distance functions declaration */

const float k = 2.;

const vec3 bat1Pos = vec3(0., 0., 0.);
const vec3 bat1Size = vec3(7.5*k, 12.*k, 10.*k);
const vec3 bat2Pos = vec3(bat1Pos.x - bat1Size.x*3., 0., 0.);
const vec3 bat2Size = vec3(10.*k, 20.*k, 10.*k);
const vec3 bat3Pos = vec3(bat1Pos.x + bat1Size.x*3., 0., bat1Pos.z - bat1Size.z*1.);
const vec3 bat3Size = vec3(10.*k, 25.*k, 10.*k);
float map(vec3 p){
	float d = -sdBox(p - vec3(0., INF, 0.), vec3(INF));
	d = min(d, bat1(p - bat1Pos));
	d = min(d, bat2(p - bat2Pos));
	d = min(d, bat3(p - bat3Pos));
	d = min(d, other(p));
	
	
	return d;
}

float bat1(vec3 p){
	float rot = pow(p.y/bat1Size.y, 2.)*(cos(time*12.)*.75+.25)*.1;
	
	p.xy = vec2(p.x*cos(rot)-p.y*sin(rot), p.y*cos(rot)+p.x*sin(rot));
	rot = pow(p.y/bat1Size.y, 2.)*cos(time*8. + PI)*.1;
	
	p.zy = vec2(p.z*cos(rot)-p.y*sin(rot), p.y*cos(rot)+p.z*sin(rot));
	float d = sdBox(p - vec3(0., bat1Size.y, 0.), bat1Size);
	d = max(d, -sdBox(p - vec3(0., bat1Size.y, 0.), bat1Size*.9));
	d = min(d, sdBox(p - vec3(0., bat1Size.y, 0.), bat1Size*.8));
	d = window(d, p - vec3(-bat1Size.x*.4 , bat1Size.y*.6, -bat1Size.z), 1.5); 
	d = window(d, p - vec3(bat1Size.x*.4 , bat1Size.y*.9, -bat1Size.z), 1.); 
	d = window(d, p - vec3(-bat1Size.x*.4 , bat1Size.y*1.1, -bat1Size.z), 1.5); 
	d = window(d, p - vec3(bat1Size.x*.4 , bat1Size.y*1.6, -bat1Size.z), 1.5); 
	d = window(d, p - vec3(-bat1Size.x*.4 , bat1Size.y*1.6, -bat1Size.z), 1.5); 
	return d ;
}

float bat2(vec3 p){
	float rot = p.y*cos(time)*.05;
	p.xz = vec2(p.x*cos(rot)-p.z*sin(rot), p.z*cos(rot)+p.x*sin(rot));
	float d = sdBox(p - vec3(0., bat2Size.y, 0.), bat2Size);
	d = max(d, -sdBox(p - vec3(0., bat2Size.y, 0.), bat2Size*.9));
	d = min(d, sdBox(p - vec3(0., bat2Size.y, 0.), bat2Size*.8));
	d = min(d, sdBox(p - vec3(0., bat2Size.y/1.75, 0.), vec3(bat2Size.x*1.05,bat2Size.y*.01,bat2Size.x*1.05 )));
	d = min(d, sdBox(p - vec3(0., bat2Size.y*2., 0.), vec3(bat2Size.x*1.05,bat2Size.y*0.01,bat2Size.x*1.05 )));
	d = window(d, p - vec3(bat2Size.x*.4 , bat2Size.y*.4, -bat2Size.z), 1.5); 
	d = window(d, p - vec3(-bat2Size.x*.4 , bat2Size.y*.4, -bat2Size.z), 1.5);
	d = window(d, p - vec3(0. , bat2Size.y*1.2, -bat2Size.z), 9.5); 
	return d;
}

float bat3(vec3 p){
	p.z-=sin(time*5. + p.y/10.)*2.;
	float d = sdBox(p - vec3(0., bat3Size.y, 0.), bat3Size);
	d = max(d, -sdBox(p - vec3(0., bat3Size.y, 0.), bat3Size*.9));
	d = min(d, sdBox(p - vec3(0., bat3Size.y, 0.), bat3Size*.8));
		return d + 1.*(cos(p.y/7.5 + time)*.5+.5)*k*.75;
}

float other(vec3 p){
	float d = sdBox(p - vec3((bat1Pos.x+bat2Pos.x)*.5, bat1Size.y*.15, -bat1Size.z*.95), vec3((bat1Pos.x-bat2Pos.x)-(bat1Size.x+bat2Size.x)*1., bat1Size.y*.15, bat1Size.z*.04));
	
	return d;
}




float window(float d, vec3 p, float size){
	d = max(d, - sdBox(p , vec3(size*1.25, size*2., size)));
	d = min(d, sdBox(p - vec3(0., -size*2., 0.), vec3(size*1.75, size*.2, size*.2)));
	return d;
}



vec3 opCRep(vec3 p, vec3 rep, vec3 size){
	return mod(p+size/2., rep);
}


float sdSphere(vec3 p, float r){
	return length(p) - r;	
}



float sdBox(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
  	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}
	



