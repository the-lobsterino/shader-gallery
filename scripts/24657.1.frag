#ifdef GL_ES
precision mediump float;
#endif

/*
Mais le singe du malheur s'est accroupi sur mon épaule
et il m'a planté dans le coeur la manivelle du souvenir
et je tourne ma ritournelle
la déchirante mélodie de l'ennui et de la douleur
*/

/*
https://soundcloud.com/pandadub/10-die-brucke?in=pandadub/sets/the-lost-ship
*/

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define CUBES_N 32
#define time mod(time, 120.)

float hash(vec2 p) {
	return fract(cos(p.x * 15.35 + p.y * 35.87) * 43758.99);
}
vec2 rotate(vec2 p, float angle){
	return vec2(p.x*cos(angle)-p.y*sin(angle), p.y*cos(angle)+p.x*sin(angle));
}

float sdBox(vec2 p, vec2 b){
  vec2 d = abs(p) - b;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

vec2 opCRep(vec2 p, vec2 r){
	return mod(p, r) - r/2.;
}

vec2 transform(vec2 uv){
	uv+=normalize(uv)*.005*(.5+.5*cos(time*5.+length(uv)*20.));
	return uv;
}

vec3 getColor(vec2 p){
	float dist = 10000.;
	
	vec2 off;
	float rotBefore;
	float rotAfter;
	float boxDist;
	for(int n = 0; n < CUBES_N; n++){
		rotBefore = float(n)+time;
		rotAfter = hash(vec2(float(n)))*2.*3.14;
		off = vec2(0., 1.)*mod(float(n)/20.-time*.1, 1.);
		boxDist = sdBox(rotate(rotate(p, rotAfter)+off, rotBefore), vec2(0.01));
		dist = min(dist, boxDist);
	}
	
	float distWeight=clamp(smoothstep(.25, .75, length(p)), 0., 1.);
	vec3 result = vec3(0.);
	result.g = mix((1.-smoothstep(-0.4, .75, length(p)))*(.5+.5*cos(p.x*2.*3.14*100.))*(.5+.5*hash(floor((p)*500.)+vec2(0., time*.0002))), 1.*distWeight, step(dist, 0.)*distWeight);
	result.rb = vec2(step(dist, 0.)*distWeight, step(dist, 0.)*distWeight*.5);


	
	
	
	float redDist = sdBox(p-vec2(0., -.25), vec2(.1, .25));
	if(redDist<0.){
		result.r=result.g*4.*(1.-smoothstep(0., .75, -p.y));
	} 
	
	float maniDist = length(p)-.1;
	if(maniDist<0.){
		result.r=result.g*4.*(1.-smoothstep(0., .75, -p.y));
	}
	float dentDist = length(p)*(.9+.1*cos(atan(p.x, p.y+.01)*16.))-.2;
	if(dentDist<0. && p.y > 0.0 && result.r==0.){
		result=vec3(result.g*4.)*(1.-length(p*3.));
	}
	if(maniDist<-0.01){
		result*=0.;
		result.r = (1.-length(p*18.)*(.90+.10*cos(time*.75*2.*3.14)))*hash(floor(p*256.+vec2(0., time*2.)));
	}
	if(maniDist<0.0075 && maniDist>0.00 && p.y>0.){
		result*=step(maniDist, 0.);
	}
	
	result*=1.-step(abs(dist), .001)*distWeight;
	//result = vec3(distWeight);
	return result;
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv-=vec2(.5);
	uv.x*=resolution.x/resolution.y;
	
	vec2 p = transform(uv);
	vec3 color = getColor(p);
	gl_FragColor = vec4(color, 1.0 );

}
//kloumpty kloumpta