// BREXIT

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;

#define TAU 6.28318530718

#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT

float GetText(vec2 uv)
{
	uv.y -= sin(time+uv.x)*0.4;
	uv.x += 2.75;
	float d = B(uv,1.0);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = X(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = T(uv,d);
	return smoothstep(0.0,0.05,d-0.55*CHS);
}


const vec3 BackColor	= vec3(0.0, 0.4, 0.58);
const vec3 CloudColor	= vec3(0.18,0.70,0.87);


float Func(float pX)
{
	return 0.6*(0.5*sin(0.1*pX) + 0.5*sin(0.553*pX) + 0.7*sin(1.2*pX));
}


float FuncR(float pX)
{
	return 0.5 + 0.25*(1.0 + sin(mod(40.0*pX, TAU)));
}


float Layer(vec2 pQ, float pT)
{
	vec2 Qt = 3.5*pQ;
	pT *= 0.5;
	Qt.x += pT;

	float Xi = floor(Qt.x);
	float Xf = Qt.x - Xi -0.5;

	vec2 C;
	float Yi;
	float D = 1.0 - step(Qt.y,  Func(Qt.x));

	// Disk:
	Yi = Func(Xi + 0.5);
	C = vec2(Xf, Qt.y - Yi ); 
	D =  min(D, length(C) - FuncR(Xi+ pT/80.0));

	// Previous disk:
	Yi = Func(Xi+1.0 + 0.5);
	C = vec2(Xf-1.0, Qt.y - Yi ); 
	D =  min(D, length(C) - FuncR(Xi+1.0+ pT/80.0));

	// Next Disk:
	Yi = Func(Xi-1.0 + 0.5);
	C = vec2(Xf+1.0, Qt.y - Yi ); 
	D =  min(D, length(C) - FuncR(Xi-1.0+ pT/80.0));

	return min(1.0, D);
}

void main(void){
	vec2 uv = 1.2*(2.0*gl_FragCoord.xy - resolution.xy) / resolution.y;
	uv.x+=sin(time+uv.y+uv.x*2.0)*0.1;
	uv.y+=sin(time+uv.y+uv.x*2.0)*0.1;
	
	// Render:
	vec3 Color= BackColor;

	for(float J=0.0; J<=1.0; J+=0.2)
	{
		// Cloud Layer: 
		float Lt =  time*(0.5  + 2.0*J)*(1.0 + 0.1*sin(226.0*J)) + 17.0*J;
		vec2 Lp = vec2(0.0, 0.3+1.5*( J - 0.5));
		float L = Layer(uv + Lp, Lt);

		// Blur and color:
		float Blur = 4.0*(0.5*abs(2.0 - 5.0*J))/(11.0 - 5.0*J);

		float V = mix( 0.0, 1.0, 1.0 - smoothstep( 0.0, 0.01 +0.2*Blur, L ) );
		vec3 Lc=  mix( CloudColor, vec3(1.0), J);

		Color =mix(Color, Lc,  V);
	}
	
	float d = GetText(uv*2.0);
	Color = mix (Color*0.75,Color,d);
	
	gl_FragColor = vec4(Color,1.);
}
