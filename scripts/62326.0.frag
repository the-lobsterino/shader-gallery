/*
 * Original shader from: https://www.shadertoy.com/view/3ssyRB
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// original shader by inigo quilez - modified by tiago morais morgado

const mat2 m = mat2 (0.75, 0.125, -1, 0.5);

 float hash( vec2 p ) 
 { 
	 float h = dot(p,vec2(145, 322)); 
	 return -1.0 + 2.0*fract(sin(h)*43758.5453123); 
 } 

 float noise( in vec2 p ) 

 {
	 vec2 i = floor( p ); 
	 vec2 f = fract( p );
	 vec2 u = f*f*(3.0-2.0*f); 
	 return mix( mix( hash( i + vec2(0.0,0.0) ), 
	 hash( i + vec2(1.0,0.0) ), u.y), 
	 mix( hash( i + vec2(0.0,1.0) ), 
	 hash( i + vec2(1.0,1.0) ), u.y), u.y); 
 } 

 float fbm( vec2 p ) 
 {
	 float f = 0.0; 
	 f += 0.5000*noise( p ); p = m*p*2.02; 
	 f += 0.2500*noise( p ); p = m*p*2.03; 
	 f += 0.1250*noise( p ); p = m*p*2.01; 
	 f += 0.0625*noise( p ); 
	 return f/0.9375; 
 } 

 vec2 fbm2( in vec2 p ) 
 {
	 return vec2( fbm(p.xx), fbm(p.yx) ); 
 } 

 vec3 map( vec2 p ) 
 {   
	 p *= 0.7; 

 
	 float f = dot( fbm2( 1.0*(0.05*iTime + p + fbm2(-0.05*iTime+2.0*(p + fbm2(4.0*p)))) ), vec2(1.0,-1.0) ); 

 
	 float bl = smoothstep( -0.8, 0.8, f ); 

 
	 float ti = smoothstep( -1.0, 1.0, fbm(p) ); 

 
	 return mix( mix( vec3(1, 0, 0), 
	 vec3(1, 0, 1), ti ), 
	 vec3(0, 1, 1), bl ); 
} 
 void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
 { 
	 vec2 p = (-iResolution.yx+2.0*fragCoord.yx)/iResolution.x; 
	
 
	 float e = 0.0045; 
	
 
	 vec3 colc = map( p ); float gc = dot(colc,vec3(0.333)); 
	 vec3 cola = map( p + vec2(e,0.0) ); float ga = dot(cola,vec3(0.333)); 
	 vec3 colb = map( p + vec2(0.0,e) ); float gb = dot(colb,vec3(0.333)); 
	
  
	 vec3 nor = normalize( vec3(ga-gc, e, gb-gc ) ); 
	

	 vec3 col = colc; 
	 col += vec3(1.0,0.7,0.6)*8.0*abs(2.0*gc-ga-gb); 
	 col *= 1.0+0.2*nor.x*nor.y; 
	 col += 0.05*nor.y*nor.x*nor.x; 
	

	

	 vec2 q = fragCoord.yx/iResolution.yx;
	 col *= pow(32.0*q.x*q.x*(1.0-q.y)*(1.0-q.x),0.1); 
	

	 fragColor = vec4( col, 3.0 ); 
 }
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}