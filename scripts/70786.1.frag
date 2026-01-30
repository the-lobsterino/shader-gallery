//Original https://www.dwitter.net/d/21339

//Original code 140 bytes - by tomxor
//for(f=_=>S((d=Math.hypot(X-74,Y-32))-t*9)/d*1e3,c.width&=i=8320;i--;x.fillStyle=R(Z=f()+f(X+=20),128-Z,192-Z))x.fillRect(X=i&127,Y=i>>7,1,1)

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define S sin
#define C cos
#define t time
#define X uv.x*64.
#define Y -uv.y*64.


vec3 Zfunc(vec2 uv){
	float d = sqrt( X * X + Y * Y );
	float f = S( d - t * 9.) / d * 10.0;
	float z = f + f;
	return vec3( z-.5, .2 - z, 1. - z );
	
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy-.5* resolution.xy )/resolution.y ;
	float d = S(time / 16.); d *= d; d *= 0.3;
	vec3 c1=Zfunc(uv-vec2(d,0));
	vec3 c2=Zfunc(uv-vec2(-d,0));
	vec3 c3=Zfunc(uv-vec2(0,d));
	vec3 c4=Zfunc(uv-vec2(0,-d));
	
	gl_FragColor = vec4( c1+c2+c3+c4, 1.0 );

}