// LIB DEM

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define CHS 0.18
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

float pMod1(inout float p, float size)
{
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize, size) - halfsize;
	return c;
}

float GetText(vec2 uv)
{
	uv.x += 5.2;
	uv.y -= 1.0;
	vec2 uv2 =uv;
	
	uv.y += time*3.15;
	float c = pMod1(uv.y,2.0);
	uv.x += sin(time*0.5+c*0.85)*1.25;
	//uv.y = mod(uv.y,2.0)-1.0;
	uv *= 1.2;
	
	float d = V(uv,1.0);uv.x -= 1.1;
	d = O(uv,d);uv.x -= 1.1;
	d = T(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 2.1;
	d = L(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = B(uv,d);uv.x -= 2.2;
	d = D(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = M(uv,d);
	

	d-=sin(uv.x*uv.y*0.9+time*0.25)*0.035;
	
	uv2.y += 6.7;
	uv2.x += 3.5;
	uv2.x += sin(time+uv2.y)*0.3;
	pMod1(uv2.x,17.0);
	d = D(uv2,d);uv2.y -= 1.6;
	d = E(uv2,d);uv2.y -= 1.6;
	d = E(uv2,d);uv2.y -= 1.6;
	d = W(uv2,d);uv2.y -= 2.6;
	d = E(uv2,d);uv2.y -= 1.6;
	d = E(uv2,d);uv2.y -= 1.6;
	d = R(uv2,d);uv2.y -= 1.6;
	d = F(uv2,d);uv2.y -= 1.6;
	
	d = smoothstep(0.0,0.05,d-0.55*CHS);
	return d;
}


// Weed formula http://www.wolframalpha.com/input/?i=polar+(1%2Bsin(theta))*(1%2B0.9+*+cos(8*theta))*(1%2B0.1*cos(24*theta))*(0.9%2B0.05*cos(200*theta))+from+theta%3D0+to+2*Pi
float weed(vec2 uv)
{
    float d = 1.0;
    float count = 5.0;
    float rad = 0.8;
    uv.y += 0.35; 
    
    float theta = atan(uv.y, uv.x); 	
    float r = 0.2* (1.+sin(theta))*(1.+.9 * cos(8.*theta))*(1.+.1*cos(24.*theta))*(.9+.05*cos(200.*theta));
    float l = length(uv);
    
    d = clamp((l - r ), 0.0, 1.0);
    uv.y -= 0.2; 

    for(float i = 0.0; i <5.0 ; ++i)
    {
      float a = time*0.2 + i / count * 6.28;
      uv += vec2(cos(a)*rad,sin(a)*rad);
    
      theta = atan(uv.y, uv.x);
     	
      r = .1* (1.+sin(theta))*(1.+.9 * cos(8.*theta))*(1.+.1*cos(24.*theta))*(.9+.05*cos(200.*theta));
      l = length(uv);
      d = min(d,clamp((l - r ), 0., 1.));
      uv -= vec2(cos(time*0.2 + i / count * 6.28)*rad,sin(time*0.2+ i / count*6.28)*rad);
    }
    return 1. - smoothstep(0., 50. / resolution.x, d);
}

void main()
{
  vec2 uv = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
  uv.x *= resolution.x / resolution.y;

  float fv = weed(uv+vec2(sin(time)*.01,cos(time)*.01));
	vec3 col = mix(vec3(0.2,0.3+0.05/min(abs(uv.y),0.2),.2),vec3(0.6, 0.8, 0.1),fv);    
	col *= min(2.1-abs(uv.x),1.1);
	uv.y += (sin(time+uv.x)*0.2);
	float dd= GetText(uv*8.0);
	col = mix(col+vec3(.8,0.8,.9)*.4, col,dd);
	
    float rf = sqrt(dot(uv, uv)) * .35;
    float rf2_1 = rf * rf + 1.0;
    float e = 1.0 / (rf2_1 * rf2_1);	
	
			
 gl_FragColor = vec4(col*e, 1.0);
}