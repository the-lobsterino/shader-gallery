#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec2 hexify(vec2 p,float hexCount){
	p*=hexCount;
	vec3 p2=floor(vec3(p.x/0.86602540378,p.y+0.57735026919*p.x,p.y-0.57735026919*p.x));
	float y=floor((p2.y+p2.z)/3.0);
	float x=floor((p2.x+(1.0-mod(y,2.0)))/2.0);
	return vec2(x,y)/hexCount;
}

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 rand3(vec2 co){
	return vec3(rand(co),rand(co+vec2(213.,2151.)),rand(co+vec2(123124.,2323.)));
}
void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) -0.5;
	p.x*=resolution.x/resolution.y;
	p*=2.3;
	p = surfacePosition;
	float l2=dot(p,p)*pow(length(p), 7.*sin(length(p)*32.-time*2.+24.0*atan(p.x, p.y)));
	if(l2<1.0){
		p=normalize(p)/(1.0-sqrt(l2));
		p+=mouse*10.0;
		gl_FragColor=vec4(rand3(hexify(p,2.0)),1);
	}else{
		gl_FragColor=vec4(l2-1.0);
	}

}