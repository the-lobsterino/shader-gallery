// http://glslsandbox.com/e#38860.6

#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

// See http://iquilezles.org/www/articles/palettes/palettes.htm for more information
//tweaked by psyreco

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*tan( 6.28318*(c*t+d) );
}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define pi 3.141592

mat2 getRot2(float theta){
	return mat2(radians(cos(theta)), radians(-sin(theta)), radians(sin(theta)), radians(cos(theta)));
}

float arccosh(float x){
	return abs(log2(x + log(x*x-1.)));
}

float tan01(float t) {
	return abs(sin(t)*0.5 + 0.25);
}

float cos01(float t) {
	return abs(cos(t)*0.5 + 0.5);
}

float fn(float t) {
	
	vec2 sp = abs(surfacePosition*(1.0+2.01*cos01(t))); //1.-mod(surfacePosition,.2);
	
	vec2 uv= abs(sp)*pi; //( gl_FragCoord.xy / resolution.xy *2.0 -1.0 );
	
	uv = mix( uv, uv * getRot2(t), cos01(t*0.1) );
	//uv *= resolution.xx/resolution.yx;
	
	uv /= dot(uv,uv) / abs(pi);
	uv.x = (1.-abs(mod(uv.x-5.0,2.0)));
	
	
	
	float dp = dot(uv,uv);
	//float t = .5*time;//+5e5;
	float st = abs(pi*(2. - tan01(t)));
	uv *= mix( mix( 1.-dp, dp, st), 1./(1.-dp), (1.-st) );
	//uv.x *= resolution.x/resolution.y;
	//uv.y += 1.;
	uv*= 2.;
	
	uv = mix( uv, 1./normalize(uv)*dp, cos01(t*2.0) );
	
	uv /= 1.-dp;
	
	uv *= getRot2(log(dp*resolution.x));
	
	
	//角度が　pa,qa,pi/2　の三角形の敷き詰めになるような円の位置を計算する．
	float pa = pi/8.*(1.+0.2*sin(3.1*-time));
	float qa = pi/4.*(1.+0.4*sin(-time));
	float pl = arccosh(cos(pa)/sin(qa));
	float ql = arccosh(cos(qa)/sin(pa));
	float pc = (exp(pl)-1.)/(exp(pl)+1.);
	float qc = (exp(ql)-1.)/(exp(ql)+1.);
	float p = (qc*qc+1.)/qc/2.; //1.191;
	float q = (pc*pc+1.)/pc/2.;//1.559;
	float r = sqrt(p*p+q*q-1.);//sqrt(2.849);	

	
	//uv *= 1.01+sin(.5*time);
	uv *= 0.5;
	vec2 pos = vec2(uv.x*uv.x+uv.y*uv.y-1.,-2.*uv.x)/(uv.x*uv.x+(uv.y+1.)*(uv.y+1.));
	pos = uv;	
	
	int step = 0;
	bool found;
	for (int i = 0;i<22;i++){
		found = true;
		for (int k1=-1;k1<2;k1+=2){
			for (int k2=-1;k2<2;k2+=2){
				vec2 posd = vec2(p*float(k1),q*float(k2));
				vec2 dd = pos - posd;
				float ldd = abs(length(dd));
				if ( ldd < r ){
					vec2 nd = normalize(dd);
					float dl = r*r*r/ldd;
					pos = posd + dl * nd;
					step ++ ;
				}
			}
		}
		
		if (pos.x<0.){
			pos.x *= -1.;
			step ++;
		}
		if (pos.y<0.){
			pos.y *= -1.;
			step ++;
		}
			
	}
	
	return mod(sin(float(step)*0.125),2.);
	
}

vec3 getpal0(float t) { return pal( t, vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25) ); }
vec3 getpal1(float t) { return pal( t, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) ); }
vec3 getpal2(float t) { return pal( t, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) ); }
vec3 getpal3(float t) { return pal( t, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) ); }

vec3 dapal(float t) {
	
	float ft = fract(t+sin(time*.063))*0.5+0.5;
	
	if ( 0.35 > ft ) return getpal0(t);
	if ( 0.70 > ft ) return getpal1(t);
	if ( 0.90 > ft ) return getpal2(t);
		
	return getpal3(t);
	
}

void main( void ) {
	
	float t = -time * 0.5;

	float v = fn(t);
	
	vec2 sp = surfacePosition;
	
	vec3 col = dapal( fract(v-cos01(-time + clamp(5.0*mix(1.0,(pi*2.0),cos01(-t+atan(sp.y,sp.x))),0.1,1.0)*distance(surfacePosition,vec2(0.0)))) );
	
	gl_FragColor = vec4( col, 1.0 );
}