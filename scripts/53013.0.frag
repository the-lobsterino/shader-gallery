#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592

float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(float p){
  float fl = floor(p);
  float fc = fract(p);
 return mix(rand(fl), rand(fl + 1.0), fc);
}
	

vec2 sicos(float alfa) {
    return vec2(sin(alfa), cos(alfa));
}

float q(float d,float alfa,vec2 uv, float W) {
	vec2 sc = sicos(alfa);
	//return 0.5+0.5*atan(W*dot(sc,uv)+d);
	return 0.5+0.5*sin(W*dot(sc,uv)+d);
}



#define W_MAX  10.0
#define D_MAX 12.5
#define RND (rand(seed+=1.0)+sin(2.0*PI*rand(seed+=1.0) + rand(seed+=1.0)*t))
	
#define D (RND*D_MAX)	
#define A (RND*2.0*PI)	
#define W (RND*W_MAX)	

float avg(float v1) {return v1;}
float avg(float v1,float v2) {return (v1+v2+sin(time))/2.0;}
float avg(float v1,float v2,float v3) {return (v1+v2+v3)/3.0;}
float avg(float v1,float v2,float v3, float v4) {return (v1+v2+v3+v4)/4.0;}
float avg(float v1,float v2,float v3, float v4, float v5) {return (v1+v2+v3+v4+v5+sin(time))/5.0;}
float avg(float v1,float v2,float v3, float v4, float v5, float v6,float v7, float v8) {return (v1+cos(time+3.14/8.)+v2+v3+v4+v5+v6+v7+v8)/8.0;}

void main( void ) {
	vec2 mouse = vec2(sin(time),cos(time));
	
	float seed=14.0;	
	float t = 0.01*time;

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) + (mouse-vec2(0.5,0.5))*0.1 - vec2(0.5,0.5);
	uv = uv + avg(q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W)  );
	uv = uv + avg(q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W)  );
	uv = uv + avg(q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W)  );
	uv = uv + avg(q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W)  );
	

	float r = avg(q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W)  );
	float g = avg(q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W)  );
	float b = avg(q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W),q(D, A, uv, W)  );
	

	gl_FragColor = vec4( r,g,b, 1.0 );
	gl_FragColor = vec4( vec3(gl_FragColor.b), 1.0 );

}