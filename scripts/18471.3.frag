//WIP ray marching

#define STEPS 32
#define MIN_DIST 0.01

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray
{
	vec3 o;
	vec3 p;
	vec3 d;
};

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

vec3 map(in vec3 p)
{
	return vec3(0, 0, 0);
}

vec3 intersect( in vec3 ro, in vec3 rd )
{
	vec3 h = vec3(0, 0, 0);
    	for(float t=0.0; t<10.0; t+=0.0)
    	{
    		h = map(ro + rd*t);
      		if( h.x<0.001 )
            		return vec3(t,h.yz);
    }
    return vec3(-1.0);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	vec3 col = vec3(0);
	
	Ray r;
	r.o = vec3(0, 0, 0);
	r.p = r.o;
	r.d = normalize(vec3(uv, 1.0));
	
	vec3 sp = vec3(0, 0, 5);
	float sr = 1.0;
	
	col = intersect(r.o, r.d);
	
	gl_FragColor = vec4(col, 1.0 );

}