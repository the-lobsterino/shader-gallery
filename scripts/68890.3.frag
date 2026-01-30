#ifdef GL_ES
precision highp float;
#endif

// moon landing was fake, they did it all in shadertoy
// wot no starz?
// fake as fuck
// also, fuck you 

#extension GL_OES_standard_derivatives : enable


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 flag ( vec2 u ) 
{
	vec3 c = vec3(1.0);
    
	if (fract(u.y*21.25)>0.5) 
	{	
		c = vec3(1,0.0,0.0);    
	}
    
	if (u.x<0.35&&u.y>0.65) 
	{
		c = vec3(0.0, 0.0, 1.0);
		
	vec2 pos = u;

	float shade = 0.8 + (0.6 + pos.x) * cos(pos.x * 6.0 - time * 4.0) * 0.2;
	vec3 color;
	if(pos.x <= 0.35 && pos.y>0.65)
	{

		color = vec3(0.0, 0.0, 1.0);
		float x, y;
		
		x = -pos.x * 28.0 - .05;
		y = pos.y * 43.0 ;
		vec2 t = vec2(fract(x)*0.9 - .45, fract(y) - .5);
		float d = length(t);
		const float starsize = .27;
		bool isstar = true;
		if(pos.y > 0.33) isstar = false;
		if(d > starsize)
		{
			t = vec2(fract(x + .5)*0.9 - .5, fract(y + .5) - .5);
			d = length(t);
		}
		{
			// following approach seems slightly faster than atan one
			// rotation matrix -36 degrees
			mat2 r = mat2(.80901699,-.58778525,.58778525,.80901699);
			mat2 r2 = mat2(.30901699,-.95105652,.95105652,.30901699);
			t.x = abs(t.x);
			t*=r2;
			t.x = abs(t.x);
			t*=r2;
			t.x = abs(t.x);
			t*=r;
			t.x = abs(t.x);
			t /= starsize;
			if(t.y < .381966 + t.x*.72654253)
				color = vec3(1.0);
		}
	} 
	c= vec3(color*shade);

		
	}
	
	return c;    
}


#define CHS 0.2

float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float LR(vec2 p, float d){p.x=abs(p.x);return line2(d,p,vec4(2,-3.25,2,3.25)*CHS);}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float TBLR(vec2 p, float d){return min(d,abs(sdBox2(p,vec2(2,3.25)*CHS)));}
float A(vec2 p,float d){d=LR(p,d);p.y=abs(p.y-1.5*CHS);return line2(d,p,vec4(2,1.75,-2,1.75)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));}
float C(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float D(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,-1,2,1)*CHS);p.y=abs(p.y);d=line2(d,p,vec4(2,1,1.5,2.75)*CHS);d=line2(d,p,vec4(1.5,2.75,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-2,3.25)*CHS);} // SUCK MY ARSEHOLE
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float F(vec2 p,float d){d=line2(d,p,vec4(2,3.25,-2,3.25)*CHS);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float G(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,2.25,2,3.25)*CHS);d=line2(d,p,vec4(2,-3.25,2,-0.25)*CHS);return line2(d,p,vec4(2,-0.25,0.5,-0.25)*CHS);}
float H(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(-2,-0.25,2,-0.25)*CHS);}
float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);}
float J(vec2 p,float d){d=line2(d,p,vec4(-1.5,-3.25,0,-3.25)*CHS);d=line2(d,p,vec4(0,-3.25,1,-2.25)*CHS);d=line2(d,p,vec4(1,-2.25,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-1.5,3.25)*CHS);}
float K(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(-2,-0.25,-0.5,-0.25)*CHS);d=line2(d,p,vec4(2,3.25,-0.5,-0.25)*CHS);return line2(d,p,vec4(-0.5,-0.25,2,-3.25)*CHS);}
float L(vec2 p,float d){d=line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float M(vec2 p,float d){p.x=abs(p.x);d=line2(d,p,vec4(2,-3.25,2,3.25)*CHS);return line2(d,p,vec4(0,0.75,2,3.25)*CHS);}
float N(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);}
float O(vec2 p,float d){return TBLR(p,d);}
float P(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d,abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float Q(vec2 p,float d){d=TBLR(p,d);return line2(d,p,vec4(2,-3.25,0.5,-1.75)*CHS);}
float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float S(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-0.25)*CHS);d=line2(d,p,vec4(-2,-0.25,2,-0.25)*CHS);return line2(d,p,vec4(2,-0.25,2,-3.25)*CHS);}
float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float U(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);}
float V(vec2 p,float d){p.x=abs(p.x);return line2(d,p,vec4(0,-3.25,2,3.25)*CHS);}
float W(vec2 p,float d){p.x=abs(p.x);d=line2(d,p,vec4(2,-3.25,2,3.25)*CHS);return line2(d,p,vec4(0,-1.25,2,-3.25)*CHS);}
float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
float Y(vec2 p,float d){d=line2(d,p,vec4(0,-0.25,0,-3.25)*CHS);p.x=abs(p.x);return line2(d,p,vec4(0,-0.25,2,3.25)*CHS);}
float Z(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
float i_(vec2 p,float d){d=line2(d,p,vec4(0.,-0.0,0.,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(.0,3.25,-0.0,3.25)*CHS);}

float GetText(vec2 uv)
{
	float t = time;
	uv*=3.;
	
	uv.x += 0.98;
	uv.y -= 3.5;
	uv.y *= 0.8;
	uv *=3.;
	float d=1.5;
	d = F(uv,1.5);uv.x -= 1.2;
	d = U(uv,d);uv.x -= 1.2;
	d = C(uv,d);uv.x -= 1.2;
	d = K(uv,d);uv.x -= 2.4;
	
	d = T(uv,d);uv.x -= 1.2;
	d = H(uv,d);uv.x -= 1.2;
	d = E(uv,d);uv.x -= 2.4;
	
	d = U(uv,d);uv.x -= 1.2;
	d = S(uv,d);uv.x -= 1.2;
	d = A(uv,d);
	d = smoothstep(0.,0.15,d-0.55*CHS);
	return d;
}


void main()
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    
	uv-=0.5;
	
	uv*=2.0+(sin(uv.x*5.6+time*0.743)*0.2);
	
	uv+=0.5;
	
	uv.x += sin(uv.y*0.32+time*0.67)*0.2;

	vec3 col = vec3(0.1, 0.1, 0.1);

	if (uv.y<cos(uv.x*3.0)/3.0) {col = vec3(0.25,.25,0.25);}
   
	float sv = sin(time*5.0-uv.x*20.0+uv.y*5.0);
    
	vec2 u = uv+vec2(0.0, sv/20.0*(uv.x-0.2));
    
	if (u.x>0.2&&u.x<0.5)
	{
		if (u.y<0.8&&u.y>0.5)
		{
            
			col = flag(u)*(1.8-max(0.9, sv/4.0+0.8));
        
		} 
	}
 
	if (abs(u.x-0.2)<.002&&uv.y<0.8) {col = vec3(min(.7/(abs(u.x-0.2)*700.0), 0.8));}

	if (uv.y<cos(uv.x*10.0)/10.0) col = vec3(0.4,0.4,0.4);

	if (uv.y<sin(uv.x*5.0)/10.0) col = vec3(0.7,0.7,0.7);

	col*=1.47-length(uv-0.5);
	uv.y += sin(time*0.6+uv.x*4.0)*0.05;
		float xd = GetText(uv*1.0);
	xd = clamp(1.0-xd,0.0,1.0);
	col+=(vec3(1.6+sin(time+uv.x*22.5)*0.7,0.7+sin(uv.x*5.0+uv.y*10.0+time*3.1)*0.3,0.3)*xd).gbr;


	gl_FragColor = vec4(col,1.0);
}
