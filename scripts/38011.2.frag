#ifdef GL_ES
precision mediump float;
#endif

// bpt.2017

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D S2;

float st = sin(time*0.13001);
float ct = cos(time*0.00010004+sin(time*0.001));

float tsin(float t) {
	float v = sin(t);
	if ( 0.0 > v ) (2.0*st+1.5*ct)-v;
	return v;
}

float unmodified_time = time*0.0083;//+1999.9;
#define time ((unmodified_time+(tsin(unmodified_time*0.0000012+ct)*0.5+0.5))*1.065+st)
#define PI 3.14159265359

//http://erkaman.github.io/glsl-cos-palette/

vec3 cospal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return mix(a + b*cos( 6.28318*(c*t+d) ), vec3(t), sin(time));
}

vec3 redyellows(float t) {
	return cospal(fract(t),vec3(0.64,0.72,0.02),vec3(0.38,0.75,0.21),vec3(0.78,0.57,0.30),vec3(0.31,0.32,0.54));
}

// // borrowing parts of and others http://glslsandbox.com/e#16672.0

float gpalmix = 0.5;

vec3 palette_(float x)
{
	return mix( vec3(x), redyellows(fract(1.-x)), gpalmix );
	return vec3(x);
	return vec3(
		sin(x*2.0*PI)+1.5,
		sin((x+1.0/3.0)*2.0*PI)+1.5,
		sin((x+2.0/3.0)*2.0*PI)+1.5
	)/2.5;
}

vec4 palette(float x)
{
	return vec4( palette_(x), 1.0 );
}

// borrowing parts of and others https://www.shadertoy.com/view/MlyXzw

mat2 rotate2d(float angle) {
    return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

float box( vec2 st, vec2 size) {
    st = smoothstep( size - 1.0,size - 4.0 / resolution.y, abs(st));
    return st.x * st.y * max(st.x,st.y);
}

float cross( vec2 st, float size) {
    return  box(st, size * vec2(1.0,1.0 / 4.0)) + box(st, size * vec2(1.0 / 4.0,1.0));
}

vec2 pow_xy( vec2 a, vec2 b ) {
	return vec2( pow( abs(a.x), b.x ), pow( abs(a.y), b.y ) );
}

void mainImage( out vec4 fragColor, vec2 uv, float t )
{
    uv *= rotate2d(cos(t*t) * PI);
	
	uv = 1.-abs(uv);
    
    uv = mix( uv * .25, 1.-uv*0.5+cos(t*1.2), sin(t*10.1)*0.5+0.5 );
    
    float duv = dot(uv,uv);
    
    uv = fract(uv/(duv*(3.0+1.5*sin(time*2.1))))*2.0-1.0;

    uv *= rotate2d(sin(t+fract(time*0.25)*2.0*PI+sin(time*20.1)) * PI);
    
    duv = dot(uv,uv);
	
    uv = mix( uv, uv * duv * duv, cos(t*11.1+1.2) * 0.5 + 0.5 );
	
    uv = mix( uv, pow_xy( uv, vec2(duv*.5) ), cos(time)*sin(time*1.5*sin(time*0.1)) * 0.5 + 0.5 );

    fragColor = vec4(cross(uv,max(0.51,3.24*duv)*abs(sin(t*10.1-sin(13.*duv*mix(duv,1.-duv,cos(t*0.1+mod(time,t))*0.5+0.5))))));
}

void mainImage2( out vec4 fragColor, vec2 uv, float t )
{
    uv *= rotate2d(cos(t*t) * PI);
    
    uv = mix( uv * .25, 1.-uv*0.5+cos(t*1.2), sin(t*10.1)*0.5+0.5 );
    
    float duv = dot(uv,uv);
    
    uv = fract(uv/(duv*(3.0+1.5*sin(time*2.1))))*2.0-1.0;

    uv *= rotate2d(abs(sin((t+fract(time*0.25)*2.0*PI-PI*0.5)+sin(time*20.1)) * PI));
    
    duv = 1.-dot(uv,uv);
	
    uv = mix( uv, uv * duv * duv, cos(t*12.1+1.2+unmodified_time) * 0.5 + 0.5 );
	
    uv = mix( uv, pow_xy( uv, vec2(duv*.5) ), cos(t)*sin(t*21.5*sin(t*2.1)) * 0.5 + 0.5 );

    fragColor = vec4(cross(uv,max(0.51,3.24*duv)*abs(sin(t*10.1-sin(13.*duv*mix(duv,1.-duv,cos(t*0.01+mod(time,t))*0.5+0.5))))));
}


float dot2( vec2 v )
{
	return dot(v,v);
}

void main( )
{
   gpalmix = sin(unmodified_time*cos(unmodified_time*0.00041)*0.00080001) * 1.5+0.75;
	
   float t = 30100.0+10050.0*sin(time*0.000021) * .000000053;
   float spin = 330.0+cos(t*2.0+unmodified_time*0.0092)*150.0;
	
   vec2 sp1 = surfacePosition;
   vec2 sp2 = mix( sp1, dot2(sp1)*((sp1.xy)), cos(unmodified_time*0.3) * 0.5 + 0.5);
	
   vec4 a, b;
	
   mainImage( a, sp1.xy * log(1000000.0+50000.0*cos(t)), spin*abs(sin( t * 11.2 + unmodified_time*0.0001 )) + spin*cos(t*0.02) + 1.20 );	
	
   mainImage( b, sp2.xy * log(100.0+501.0*cos(t*221.3)), spin*abs(sin( t * 1000.2 + time*0.01 )) + spin*5.0*cos(t*10.02) );	
	
   b = palette( length(a-b) );

   vec4 bak = texture2D(S2, gl_FragCoord.xy);	
	
   gl_FragColor = clamp( mix( 1.-bak, mix( a, b, sin(st*1.5+3.0*cos(t*21.5))*0.5+0.5 ), 1.-0.75*sin(t+cos(0.3*t))+0.25), 0.0, 1.0 );
	
}

