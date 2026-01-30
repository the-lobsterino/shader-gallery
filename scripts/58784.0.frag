#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
const int max=25;

vec2 mul(vec2 a,vec2 b){
	return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);
}

vec2 pow(vec2 a,int p){
	vec2 r=vec2(1.0,0.0);
	int j=0;
	for(int i=0;i<max;i++){
		if(i<p){
		r=mul(r,a);
		}else{
			break;
		}
	}
	return r;
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	//vec2 p=gl_FragCoord.xy/resolution.x-vec2(0.5,resolution.y/resolution.x/2.0);
	vec2 p=surfacePosition;
	p*=4.0;
	p=pow(p,2)*sin(time+p.x+10.5/p.y);//-(mouse-0.5)*5.0;
	float l=clamp(length(p),.0,1.);
	gl_FragColor=vec4(hsv2rgb(vec3(atan(p.x,p.y),1.0,l)),1.0);

}