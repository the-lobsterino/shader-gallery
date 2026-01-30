#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Base was Brandon Fogerty shader : http://glslsandbox.com/e#27370.3 

float hash( vec2 p )
{
    return fract( sin( dot(p, vec2( 15.79, 81.93  ) ) * 45678.9123 ) );
}

float noise(vec2 p){
	
	vec2 i=floor(p);
	vec2 f=fract(p);
	
	f=f*f*(3.0-2.0*f);
	
	float bottomX=mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), f.x);
	float upX=mix(hash(i+vec2(0.0, sin(time/4.0))), hash(i+vec2(1.0,1.0)), f.x);
	
	float res=mix(bottomX, upX, f.y);
	
	
	
	return res;

}


float fbm(vec2 p){
	float sum=0.0;
	float am=0.75;
	
	for(int i=0;i<8;i++){
		sum+=noise(p)*am;
		p*=49.962342345430*(1.0/cos(time/2.0));
		am/=5.0*(1.0/sin(time/2.0));
	}
	
	return sum;

}

void main( void ) {

	vec2 pos=(gl_FragCoord.xy/resolution.xy)*2.0-1.0;
	pos.x*=resolution.x/resolution.y;
	
	
	float joy=abs(fbm(pos*2.0));
	
	float t=joy*abs(fbm(pos));
	
	vec3 color=vec3(t, 2.0*t, 5.0*t);
	
	
	gl_FragColor=vec4(color, 1.0);
}