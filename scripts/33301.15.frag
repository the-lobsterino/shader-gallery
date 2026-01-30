#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize; 
uniform sampler2D backbuffer;
varying vec2 surfacePosition;

vec4 escherlike( vec2 U, float t );

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec2 rotate2d( vec2 v, float _angle ) {
	return v * rotate2d(_angle);
}

vec3 hsbToRGB(float h,float s,float b){
	return b*(1.0-s)+(b-b*(1.0-s))*clamp(abs(abs(6.0*(h-vec3(0,1,2)/3.0))-3.0)-1.0,0.0,1.0);
}

vec3 colorFunc(float h,float t) {
	return fract(hsbToRGB( h, 1.0, h/(0.5 + (sin(t)*0.5+0.5))));
}

vec2 dotProductInversion( vec2 uv, float d ) {
	float duv = dot(uv,uv);
	return uv/duv;
	//return ( d < duv ) ? uv / duv : uv * duv;
}

bool bchecker(vec2 uv, float size) {
	uv = floor(fract(uv*size)+0.5);
	return (uv.x<uv.y)^^(uv.y<uv.x);
}

float dott( vec2 v ) {
	return dot(v,v);
}

float checkerpositive(vec2 uv, float size) {
	return dott( escherlike( uv * (3000.0 + 1500.0 * sin(time*0.125)), time+dott(uv)*10.0).xy );
}

float checkerpositivenegative(vec2 uv, float size) {
	return bchecker(uv,size) ? 1.0 : -1.0;
	uv = floor(fract(uv*size)+0.5);
	return checkerpositive(uv,size)*2.0-1.0;
}

const int nINVERSIONS = 0;

vec4 pervinversions_bpt( vec2 uv ) {

	vec2 sp = dotProductInversion(surfacePosition*100.0,0.5);
	float N = (sin(time)*1.0+2.0)*1.0;
	
	for ( int i = 0; i < nINVERSIONS; i++ ) {
		sp = dotProductInversion( ((sp)*3.0) * 2.0 - 1.5, 1.5*sin(time*3.0) );//*checkerpositive((sp-mouse),N/2.0);
	}
	
	vec2 position = sp + mouse;

	vec4 color = vec4(vec3(checkerpositive(position,N)),1.0);//vec4( colorFunc( checkerpositive(position,N), 1.0 ), 1.0 );

	float strobe = time*1.0;;//fract(time*2.0);//*sin(time));
	return fract( exp(color) / escherlike(position,1.0) );//, 0.0, 1.0+dot(sp,sp) );
}

void main( void ) {
	
	vec2 sp = dotProductInversion( sin(surfacePosition*10.0) * 2.5, 1.2 );
	
	gl_FragColor = pervinversions_bpt( sp );
	
	gl_FragColor = vec4( colorFunc( length(gl_FragColor), sin(time) ), 1.0 );

}

// ----------------------------------------------------------------

// https://www.shadertoy.com/view/4dVGzd

float iGlobalTime = time * 1e5;
vec2 iResolution = resolution;
void mainImage( out vec4 fragColor, in vec2 fragCoord ); 
vec4 iMouse = vec4(mouse, 0.0, 1.0);
vec4 iDate = vec4(time,time,time,time);

vec4 escherlike( vec2 U, float t )
{
	U = rotate2d(U,1./t);
	
	U *= 12./iResolution.y;
	vec4 O = vec4(0.0);
	vec2 f = floor(U), u = 2.*fract(U)-1.;  // ceil cause line on some OS
	float b = mod(f.x+f.y,2.), y;
	
	for(int i=0; i<4; i++) 
		u *= mat2(0,-1,1,0),
		y = 2.*fract(.2*t+U.x*.01)-1.,
		O += smoothstep(.55,.45, length(u-vec2(.5,1.5*y)));
	
	//if (b>0.) O = 1.-O; // try also without :-)
	return O;
}

// ----------------------------------------------------------------

