 /**\  /**\
/*||*\	||
  ||	Lt==> Change  resolution to 1 :)
  ||
  Lt==> Click hide code :*

*/



//////////////////////////////////
//				//
//          VRG corp	      	//
//				//
//       Hola de la vega	//
//	  Holo de la vega	//
//	   Halo de la vega	//
//	       ....		//
//			       //
//////////////////////////////// *

// https://soundcloud.com/old-habits/wax-stag-night-trek-bibio-remix

// Tried pop corn/thomae's fractal rendering
//	Used : 	* http://iquilezles.org/www/articles/popcorns/popcorns.htm
//		* https://www.shadertoy.com/view/Mdl3RH


#define FIX_THE_SAVE_BUG_:(

#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

#define PI 3.1415
#define time (0.05*time)
//#define GAMMA
//#define MOUSE_TORCH


vec2 scale =2./resolution.xy;
float detailsScale = 1.;

float t0 = 01.0*time+0.0;
float t1 = -1.5*time+2.0;
float t2 = 01.2*time+3.0;
float t3 = 01.6*time+1.0;
float random(vec2 seed) {
	#ifdef FIX_THE_SAVE_BUG_:(
	return 1.*.5/.75;
	#else
    	return fract(sin(seed.x + seed.y * 1e3) * 1e5);
	#endif
}

float f(vec2 uv){
	return cos(t0 + uv.y + cos(t1 + PI*uv.x)); 
}

float g(vec2 uv){
	return cos(t2 + uv.x + cos(t3 + PI*uv.y)); 
}

vec2 getOffset(vec2 p){
	
	p.x*=resolution.x/resolution.y;
	p/=4.;
	vec2 tmpP = vec2(cos(p.x*10.+cos(t0+p.y*2.)), sin(p.y*10.+cos(t2+p.x*2.)));
	tmpP.x = f(p*5.);
	tmpP.y = g(p*5.);
	float rot = (atan(tmpP.y, tmpP.x)+(cos(time*.01)*PI+length(tmpP)+p.x+t1+p.y+t3)*10.);
	return vec2(cos(rot), sin(rot))*scale;
	
}

vec2 next(vec2 p){
	vec2 offset = getOffset(p*.5)+getOffset(p)*.5+getOffset(p*2.)*.25+getOffset(p*4.)*.125+getOffset(p*8.)*.625;
	
	return p+offset;
}

vec2 rotate(vec2 p, float angle){
	return vec2(p.x*cos(angle)-p.y*sin(angle), p.y*cos(angle)+p.x*sin(angle));
}


void main( void ) {

	vec2 p = gl_FragCoord.xy / resolution.xy;

	vec4 density = vec4(texture2D(bb,mod(next(p), vec2(1.))));
	
	#ifdef GAMMA
	//density = pow(clamp(density, vec4(0.), vec4(1.)), vec4(.5 / 1.0));
	#endif

	gl_FragColor = mix(vec4(cos(p.x*10.+2.*cos(time*2.*2.*PI))*.5+.5, cos(p.y*10.-2.*sin(time*1.*2.*PI))*.25+.75, cos(p.x*10.+p.y*10.)*.5+.5, 1.)*(.5+.75*random(p+vec2(random(vec2(time))))), density, .9);
	
	float inTorch = smoothstep(0., 0.5, length((p-mouse)*resolution.xx/resolution.yx)-0.45);
	gl_FragColor = mix(gl_FragColor, gl_FragColor-vec4(1.), inTorch*.125);
	
	p = rotate(p-vec2(.5), (cos(time*4.5)*.1-.2)*4.*2.*PI);
	
	gl_FragColor = mix(gl_FragColor, vec4(length(gl_FragColor.rgb/2.)), smoothstep(2.4, 2.5,mod(p.x*resolution.x/resolution.y+p.y-time*5.,2.5)));
	gl_FragColor = mix(gl_FragColor, vec4(0.), smoothstep(2.45, 2.5,mod(p.x*resolution.x/resolution.y+p.y-time*5.,2.5)));
	
	// Gamma correction
	#ifdef GAMMA
	gl_FragColor = pow(clamp(gl_FragColor, vec4(0.), vec4(1.)), vec4(1.0 / .5));
	#endif
}