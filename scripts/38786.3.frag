#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash( float n ){
    return fract(sin(n)*758.5453);
    //return fract(mod(n * 2310.7566730, 21.120312534));
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

float noise2d( in vec2 x ){
    vec2 p = floor(x);
    vec2 f = smoothstep(0.0, 1.0, fract(x));
    float n = p.x + p.y*57.0;
    return mix(mix(hash(n+0.0),hash(n+1.0),f.x),mix(hash(n+57.0),hash(n+58.0),f.x),f.y);
}

 float configurablenoise(vec3 x, float c1, float c2) {
	vec3 p = floor(x);
	vec3 f = fract(x);
	f       = f*f*(3.0-2.0*f);

	float h2 = c1;
	 float h1 = c2;
	#define h3 (h2 + h1)

	 float n = p.x + p.y*h1+ h2*p.z;
	return mix(mix(	mix( hash(n+0.0), hash(n+1.0),f.x),
			mix( hash(n+h1), hash(n+h1+1.0),f.x),f.y),
		   mix(	mix( hash(n+h2), hash(n+h2+1.0),f.x),
			mix( hash(n+h3), hash(n+h3+1.0),f.x),f.y),f.z);

}

float supernoise3d(vec3 p){

	float a =  configurablenoise(p, 883.0, 971.0);
	float b =  configurablenoise(p + 0.5, 113.0, 157.0);
	return (a + b) * 0.5;
}
float supernoise3dX(vec3 p){

	float a =  configurablenoise(p, 883.0, 971.0);
	float b =  configurablenoise(p + 0.5, 113.0, 157.0);
	return (a * b);
}
float cloudsfrontsfbm(vec3 p){
	float a = 0.0;
    float w = 1.0;
    float wc = 0.0;
	for(int i=0;i<4;i++){
        //p += noise(vec3(a));
		a += clamp(2.0 * abs(0.5 - (supernoise3dX(p))) * w, 0.0, 1.0);
		wc += w;
        w *= 0.5;
		p = p * 3.0;
	}
	return a / wc;// + noise(p * 100.0) * 11;
}
float getFronts(vec3 p){
	return cloudsfrontsfbm(p + (cloudsfrontsfbm(p * 0.4) * 0.5 * vec3(1.0, 1.0, 0.0)) - (cloudsfrontsfbm(-p * 0.4) * 0.5 * vec3(-1.0, 1.0, 0.0)));	
}
void main( void ) {
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	position *= 10.0;
	
	float color = getFronts(vec3(position + time * 0.1,time * 0.1));

	gl_FragColor = vec4( vec3( color ) , 1.0 );

}