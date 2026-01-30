#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define P 3.1415926
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ntsf(float x,float k) {
	x = clamp(x,-1.0,1.0);
	return (x-x*k)/(k - abs(x) * 2.0 * k + 1.0);
}

precision lowp    float;

float PHI = 1.61803398874989484820459 * 00000.1; // Golden Ratio   
float PI  = 3.14159265358979323846264 * 00000.1; // PI
float SQ2 = 1.41421356237309504880169 * 10000.0; // Square Root of Two

float gold_noise(in vec2 coordinate, in float seed){
    return fract(tan(distance(coordinate*(seed+PHI), vec2(PHI, PI)))*SQ2);
}

void main( void ) {
	vec2 uv=gl_FragCoord.xy/resolution;
	float period=2.0*P;
	float translate=0.1*time;
//	vec2 compareP=vec2(uv.x,sin(uv.x*period-translate)/2.1 +0.5);
//	float disDiff=distance(uv,compareP);
//	vec3 color=1.0-max(vec3(0.0),ntsf(disDiff,mouse.x*2.0-1.0));

#if 0
	float x = 2.0*(uv.x-0.5);
	float y = 2.0*(uv.y-0.5);

	float d = sqrt(x*x + y*y);
	float s = 0.5;
	float e = clamp(1.0-abs(s-d),0.0,1.0);
	
	vec3 color = vec3(ntsf(e,0.99));
	
	gl_FragColor=vec4(color,1.0);
	
	vec4 c1 = vec4(1,0,0,1);
	vec4 c2 = vec4(0,1,0,1);
	vec4 c3 = vec4(1,1,0,1);
	vec4 c4 = vec4(0,0,1,1);
#endif
	
#if 0
	float x = 2.0*(uv.x-0.5);
	float y = 2.0*(uv.y-0.5);

	float d = sqrt(x*x*x*x*x*x*x*x + y*y*y*y*y*y*y*y);
	float s = 0.5;
	float e = clamp(s-d,-1.0,1.0);
	
	vec4 screen = vec4(0.0,1.0,0.0,1.0)/4.0 + vec4(gold_noise(uv,time*3.0),gold_noise(uv,time*5.0),gold_noise(uv,time*7.0),1.0);
	
	gl_FragColor=mix(vec4(0.0,0.0,0.0,1.0),screen,ntsf(e,-0.99));
	
	vec4 c1 = vec4(1,0,0,1);
	vec4 c2 = vec4(0,1,0,1);
	vec4 c3 = vec4(1,1,0,1);
	vec4 c4 = vec4(0,0,1,1);	
	
	
	
#endif
	
#if 0
	vec2 A = vec2(0.3,0.7);
	vec2 B = vec2(0.6,0.2);
	
	float d = distance(A,B);
	float d1 = distance(A,uv);
	float d2 = distance(B,uv);
	
	vec2 N = normalize(B-A);
	vec2 Np;
	Np.x = N.y;
	Np.y = -N.x;
	
	float l = dot(Np,uv-A);
	float p = dot(N,uv-A);
	
	float plotLine = (p>=0.0 && p/d <=1.0) ? ntsf(clamp(1.0-abs(l),0.0,1.0),0.99) : 0.0;
	
	float b = 0.02/d1 + 0.02/d2 + plotLine;
	
	gl_FragColor = vec4(b);
	
	
#endif
	
#if 1
	float w = 0.5;
	float h = 0.5;
	float xn = 2.0*(uv.x-0.5);
	float yn = 2.0*(uv.y-0.5);
	vec4 color;

	float A = time;
	
	float x = xn * cos(A) + yn * sin(A);
	float y = xn * -sin(A) + yn * cos(A);

	vec2 point;
	if(y > 0.0) {
		if(x > 0.0) {
			// top right
			if(x > w) {
				// off right
				if(y > h) {
					// off right & top
					point = vec2(w,h);
				} else {
					// right side
					point = vec2(w,y);
				}
			} else {
				// inside right
				if(y > h) {
					// off top
					point = vec2(x,h);
				} else {
					// inside top right
					if(h-y < w-x) {
						point = vec2(x,h);
					} else {
						point = vec2(w,y);
					}
				}
			}
		} else {
			// top left
			if(x < -w) {
				// off left
				if(y > h) {
					// off left & top
					point = vec2(-w,h);
				} else {
					// left side
					point = vec2(-w,y);
				}
			} else {
				// inside left
				if(y > h) {
					// off top
					point = vec2(x,h);
				} else {
					// inside top left
					if(h-y < w+x) {
						point = vec2(x,h);
					} else {
						point = vec2(-w,y);
					}
				}
			}			
		}
	} else {
		if(x > 0.0) {
		// bottom right
			if(x > w) {
				if(y < -h) {
					point = vec2(w,-h);
				} else {
					point = vec2(w,y);
				}
			} else {
				if(y < -h) {
					point = vec2(x,-h);
				} else {
					if(h+y < w-x) {
						point = vec2(x,-h);
					} else {
						point = vec2(w,y);
					}
				}
			}
		} else {
			if(x < -w) {
				if(y < -h) {
					point = vec2(-w,-h);
				} else {
					point = vec2(-w,y);
				}
			} else {
				if(y < -h) {
					point = vec2(x,-h);
				} else {
					if(h+y < w+x) {
						point = vec2(x,-h);
					} else {
						point = vec2(-w,y);
					}
				}
			}			
		}
	}
	
	
	float e = distance(vec2(x,y),point);
	
	gl_FragColor = vec4(ntsf(1.0-e,0.99));
	
#endif
	
#if 0
	float w = 0.5;
	float h = 0.5;
	float x = 2.0*(uv.x-0.5);
	float y = 2.0*(uv.y-0.5);
	vec4 color;
	vec2 point1;
	vec2 point2;
	vec2 point3;
	vec2 point4;
	
	float g = 0.0;
	
	if(x<-w) {
		point1 = vec2(-w+g,h-g);	
	} else if(x > w) {
		point1 = vec2(w-g,h-g);
	} else {
		point1 = vec2(x,h);
	}
	if(x<-w) {
		point2 = vec2(-w+g,-h+g);	
	} else if(x > w) {
		point2 = vec2(w-g,-h+g);
	} else {
		point2 = vec2(x,-h);
	}
	if(y>h) {
		point3 = vec2(-w+g,h-g);	
	} else if(y < -h) {
		point3 = vec2(-w+g,-h+g);
	} else {
		point3 = vec2(-w,y);
	}
	if(y>h) {
		point4 = vec2(w-g,h-g);	
	} else if(y < -h) {
		point4 = vec2(w-g,-h+g);
	} else {
		point4 = vec2(w,y);
	}
		
	float e1 = ntsf(1.0-distance(vec2(x,y),point1),0.99);
	float e2 = ntsf(1.0-distance(vec2(x,y),point2),0.99);
	float e3 = ntsf(1.0-distance(vec2(x,y),point3),0.99);
	float e4 = ntsf(1.0-distance(vec2(x,y),point4),0.99);
	float e = e1+e2+e3+e4;
	
	gl_FragColor = vec4(e);

#endif
	
#if 0
	float A = -6.283185307179586;
	float B = 6.283185307179586;
	float xn = 2.0*(uv.x-0.5);
	float yn = 2.0*(uv.y-0.5);

	float C = time;
	float D = time*1.2;
	
	float x = xn * cos(C) + yn * sin(D);
	float y = xn * -sin(D) + yn * cos(C);

	float xx = (x+sin(y*(A+sin(time*1.1))));
	float yy = (y+cos(x*(B+cos(time*0.97)))); 
	
	float e = 1.0 - abs(xx*xx+yy*yy - 1.0);
	
	gl_FragColor = vec4(
		ntsf(e,0.9+1.5*sin(time*10.0)),
		ntsf(e,0.9+0.7*sin(time*10.0)),
		ntsf(e,0.9+0.5*sin(time*10.0)),
		1.0);
	
#endif
	
	
}