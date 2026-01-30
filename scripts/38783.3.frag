#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#//umu

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi 3.141592

mat2 getRot2(float theta){
	return mat2(cos(theta), -sin(theta), sin(theta), cos(theta));
}

float arccosh(float x){
	return log(x + sqrt(x*x-1.));
}

void main( void ) {

	vec2 uv= ( gl_FragCoord.xy / resolution.xy ) *2.0 -1.0;
	uv.x *= resolution.x/resolution.y;
	uv.y += 1.;
	uv*= 1.;
	
	//角度が　pa,qa,pi/2　の三角形の敷き詰めになるような円の位置を計算する．
	float pa = pi/8.*(1.+0.2*sin(3.1*time));
	float qa = pi/4.*(1.+0.4*sin(time));
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
	//pos = uv;	
	
	int step = 0;
	bool found;
	for (int i = 0;i<22;i++){
		found = true;
		for (int k1=-1;k1<2;k1+=2){
			for (int k2=-1;k2<2;k2+=2){
				vec2 posd = vec2(p*float(k1),q*float(k2));
				vec2 dd = pos - posd;
				if ( length(dd) < r ){
					vec2 nd = normalize(dd);
					float dl = r*r/length(dd);
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
	
	float ma = 1.;//abs(sin(time))*32.;	
	vec3 col = vec3(mod(float(step),2.))/ma;
	//col *= length(uv)<1.?1.0:0.0;
	
	
	gl_FragColor = vec4(col,1.);

	

}