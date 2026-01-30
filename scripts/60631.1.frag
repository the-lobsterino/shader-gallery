#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;

#define warp 1.5
void rgb(int g){
	gl_FragColor.rgb = vec3(g)/255.;
}

void rgb(int r, int g, int b){
	gl_FragColor.rgb = vec3(r,g,b)/255.;
}

void main( void ) {
	gl_FragColor = vec4(1);
	rgb(249);
	
	vec2 p = surfacePosition;
	vec2 r = vec2(length(p), atan(p.x,p.y));
	
	float r_inner = 0.16;
	float r_outer = 0.42;
	if(r.x > r_inner && r.x < r_outer){
		float sy = -0.5*(r.y/3.14159);
		float sx = (r.x-r_inner)/(r_outer-r_inner);
		sx *= 3.;
		sx = pow(sx, warp*(1.-sx));
		sx /= 2.;
		sx -= 0.45;
		
		float ph = fract(sy+sx+sin(0.1*time+r.x*1.5*3.14*sin(time*.3456)));
		if(ph < 0.333){
			rgb(255,206,68);
		}else if(ph < 0.666){
			rgb(221,80,68);
		}else{
			rgb(29,163,98);
		}
	}else if(r.x < r_inner){
		if(r.x < (r_inner-0.025)){
			rgb(76,139,245);
		}else{
			gl_FragColor.rgb = vec3(1);
		}
	}
	
	
}