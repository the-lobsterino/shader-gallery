#ifdef GL_ES
precision mediump float;
#endif

#define ITERATIONS 10.0
#define BOUND 2.0
const float POW = 5.;
#define EPS   0.001

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 sqCpx(vec2 a){
	return vec2( a.x*a.x - a.y*a.y, a.x*a.y + a.y*a.x);
}
vec2 Power(vec2 v, float n)
{
	float r=length(v);
	float ang=atan(v.y,v.x);
	return pow(r,n)*vec2(cos(ang*n),sin(ang*n));
}
vec2 Inv2(vec2 v)
{
	float r=length(v);
	if(r!=0.0)return vec2(v.x/r/r,-v.y/r/r);
	else return v;
}
vec2 Mul2(vec2 u,vec2 v)
{
	return vec2(u.x*v.x-u.y*v.y,u.x*v.y+u.y*v.x);
}
float NewTon(vec2 z)
{
	vec2 dz,f,df,ddf,ddz,c=vec2(sin(time),cos(time));
	for(float i = 1.0; i < ITERATIONS; i++){
	   	f=Power(z,POW)-c; //z^p-1=0
		df=POW*Power(z,POW-1.0);
		dz=-Mul2(Inv2(df),f);
		z+=dz;
		if(length(dz)<0.001)return 0.0;
	}
		ddf=POW*(POW-1.0)*Power(z,POW-2.0);
	ddz=Mul2(Inv2(Mul2(df,df)),Mul2(f,ddf));
	float lens=length(ddz);
	return lens;
//	return length(dz);
}
float toEsc(vec2 p) {
	vec2 z = p;
	for(float i = 1.0; i < ITERATIONS; i++){
		z = Power(z,POW) + p;
		if(length(z) > BOUND) return i;
	}
	return 0.0;
}
	
void main( void ) {
	// The mandelbrot set.
	// It works!
	vec2 scale = vec2(resolution.x / resolution.y, 1); // converts from square to rectangular
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * scale * 4.0 - scale*2.0;
	//+ (mouse*2.0-vec2(1,1)) * scale * (-1.0);
	float b = NewTon(position);

	if(b < EPS){
		gl_FragColor=vec4(0.0,0.0,0.0,1.0);
		//check out your video card memory!
	} else {
		float bx=NewTon(vec2(position.x+EPS,position.y));
		float by=NewTon(vec2(position.x,position.y+EPS));	
		vec2 lr=vec2(0.7,0.7),lg=vec2(-0.7,0.7),lb=vec2(0,-0.70);
		vec2 norm=normalize(vec2(bx-b,by-b));
		vec3 color=vec3(dot(lr,norm),dot(lg,norm),dot(lb,norm));
		color=clamp(color,0.0,1.0);
		gl_FragColor=vec4(color,1.0);
//		gl_FragColor = vec4( sin(b)/2.0+1.0, sin(b+1.04)/2.0+1.0, sin(b+2.04)/2.0+1.0, 1.0 );
	}

}