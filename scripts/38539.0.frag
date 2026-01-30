#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
 
// afl_ext 2017

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D sampler;
vec2 uv = vec2(0.0);

#define memload(a) texture2D(sampler, vec2((a) / resolution.x, 0.5)).w
float memoutput = 0.0;
#define memsave(a,v) memoutput=mix(v, memoutput, step(1.0, abs(a - gl_FragCoord.x)));

#define balls 1
#define ballstructsize 2.0*2.0*4.0

struct Ball{
	vec2 pos;
	vec2 vel;
	vec2 oldpos;
};

Ball loadball(float index){
	return Ball(
		vec2(memload(index * ballstructsize + 0.0), memload(index * ballstructsize + 2.0)),
		vec2(memload(index * ballstructsize + 4.0), memload(index * ballstructsize + 6.0)) * 2.0 - 1.0, 
		vec2(0.0)
	);
}

void saveball(float index, Ball ball){
	memsave(index * ballstructsize + 0.0, ball.pos.x);
	memsave(index * ballstructsize + 2.0, ball.pos.y);	
	memsave(index * ballstructsize + 4.0, ball.vel.x * 0.5 + 0.5);
	memsave(index * ballstructsize + 6.0, ball.vel.y * 0.5 + 0.5);	
}

Ball ballsobjs[balls];

void loadballs(){
	float iter = 0.0;
	for(int i=0;i<balls;i++){
		ballsobjs[i] = loadball(iter);
		iter += 1.0;
	}
}
float hash( float n ){
    return fract(sin(n)*758.5453);
}

float noise3d( in vec3 x ){
	vec3 p = floor(x);
	vec3 f = fract(x);
	f       = f*f*(3.0-2.0*f);
	float n = p.x + p.y*157.0 + 113.0*p.z;

	return mix(mix(	mix( hash(n+0.0), hash(n+1.0),f.x),
			mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
		   mix(	mix( hash(n+113.0), hash(n+114.0),f.x),
			mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

void updateballs(){
	float iter = 0.0;
	for(int i=0;i<balls;i++){
		ballsobjs[i].oldpos = ballsobjs[i].pos;
		vec2 n = normalize((mouse) - ballsobjs[i].pos);
		float D = distance(mouse, ballsobjs[i].pos.xy);
		ballsobjs[i].vel +=  0.05 * n * (1.0 / (D * 5.0 + 0.2));
		ballsobjs[i].pos += ballsobjs[i].vel * 0.04;
		ballsobjs[i].vel += (vec2(noise3d(vec3(uv.x, uv.y + iter, time) * 40.4), noise3d(vec3(-uv.x, -uv.y + iter, -time) * 40.4)) * 2.0 - 1.0) * 0.01;
		ballsobjs[i].vel = clamp(ballsobjs[i].vel, -1.0, 1.0);
		ballsobjs[i].pos = clamp(ballsobjs[i].pos, -1.0, 1.0);
		ballsobjs[i].vel *= 0.99;
		ballsobjs[i].vel += vec2(0.0, -0.02);
		// branchless collision box!
		ballsobjs[i].vel.y *= max(-0.95, sign(ballsobjs[i].pos.y));
		ballsobjs[i].vel.x *= max(-0.95, sign(ballsobjs[i].pos.x));		
		ballsobjs[i].vel.x *= mix(1.0, -0.8, step(1.0, ballsobjs[i].pos.x));
		iter += 1.0;
	}
}

void saveballs(){
	float iter = 0.0;
	for(int i=0;i<balls;i++){
		saveball(float(iter), ballsobjs[i]);
		iter += 1.0;
	}
}

vec3 visualizeballs(){
	vec3 res = vec3(0.0);
	float iter = 0.0;
	vec2 ratio = vec2(1.0, resolution.y / resolution.x);
	for(int i=0;i<balls;i++){
		float fi = iter * 1.2425546;
		iter += 1.0;
		vec2 p1 = ballsobjs[i].oldpos;
		vec2 p2 = ballsobjs[i].pos;
		float it = 0.0;
		vec3 C = (vec3(sin(fi), cos(fi), sin(fi*20.0)) * 0.2 + 0.8 );
		for(int i=0;i<5;i++){
			vec2 p = mix(p1, p2, it);
			res += 0.2 * (1.0 - smoothstep(0.008, 0.01, distance(p * ratio, uv * ratio ))) * C;
			it += 0.2;
		}
	}	
	return res;
}
varying vec2 surfacePosition;
void main( void ) {
	uv = ( gl_FragCoord.xy / resolution.xy ); 
	loadballs();
	updateballs();
	vec3 c = visualizeballs();
	saveballs();
	gl_FragColor = vec4( 1.0 - c,  memoutput );

}