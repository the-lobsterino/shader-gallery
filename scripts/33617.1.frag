#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float black(float x, float y, float t) {
	float f1=t*2.;
	float f2=clamp(f1-1.,0.,1.);
	float p= pow(2.,max(1.,1./(1.-f2))*max(1.,1./(1.-f2)));
	float r = min(f1,1.0);
	float f = smoothstep(r+r*.1,r,pow(x,p)+pow(y,p));
	return f;
}

float white(float x, float y, float t) {
	return 1.0-black(x,y,t);
}

float fun(vec2 uv,float t) {
	float x = uv.x;
	float y = uv.y;
	x=fract(x)*2.-1.;
	y=fract(y)*2.-1.;
	return fract(t/2.)<.5?white(x,y,fract(t)):black(x,y,fract(t));
}
bool xor(bool a, bool b) {
	return true;//(a||b) && (!(a&&b));
}
void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	vec2 uv = pos;
	uv-=0.5;
	uv.x*=resolution.x/resolution.y;
	uv*=100.;
	
	vec4 col = vec4(0.0);
	
	float x = uv.x;
	float y = uv.y;
	//xor((fract(y/2.)*2.-fract(y))>.5,(fract(x/2.)*2.-fract(x))>.5)
	float f=fun(uv,abs(((x/10.0*mouse.x+time/20.)-.5)*1.));
	
	vec4 c1=vec4(.1,.5,.7,1.);
	vec4 c2=vec4(.9,.8,.0,1.);
	col = mix(c1,c2,f);
	gl_FragColor = col;

}