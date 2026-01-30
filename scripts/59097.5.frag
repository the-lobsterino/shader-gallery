precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 RR = resolution;
vec2 Offset;
vec2 Scale=vec2(0.001,0.001);
float Saturation = 1.0;
vec3 lungth(vec2 x,vec3 c){
       return vec3(length(x+c.r),length(x+c.g),length(c.b));
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
float D(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,-1,2,1)*CHS);p.y=abs(p.y);d=line2(d,p,vec4(2,1,1.5,2.75)*CHS);d=line2(d,p,vec4(1.5,2.75,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-2,3.25)*CHS);}
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
float GetText(vec2 uv)
{
	float t = time;
	uv*=4.5;
	uv *= sin(t+uv.y*2.0)+6.0;
	uv.x += 7.5;
	uv.y -= 0.5;
	float d;
	float uvx = uv.x;
	d = T (uv, 1.0);uv.x -= 1.1;
	d = H(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = S(uv,d);uv.x -= 2.1;
	d = I(uv,d);uv.x -= 1.1;
	d = S(uv,d);uv.x -= 2.1;
	d = T(uv,d);uv.x -= 1.1;
 	d = H(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 2.1;
	d = W(uv,d);uv.x -= 1.1;
	d = A(uv,d);uv.x -= 1.1;
	d = Y(uv,d);uv.x -= 1.1;
	uv.y += 2.0;
	uv.x = uvx + -1.0;
 	d = I(uv,d);uv.x -= 2.1;
	d = H(uv,d);uv.x -= 1.1;
	d = A(uv,d);uv.x -= 1.1;
	d = V(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 2.1;
 	d = S(uv,d);uv.x -= 1.1;
	d = P(uv,d);uv.x -= 1.1;
	d = O(uv,d);uv.x -= 1.1;
	d = K(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = N(uv,d);uv.x -= 1.1;
	d = smoothstep(0.,0.05*abs(sin(time*2.)+1.4),d-0.55*CHS);
	return d;
}
void main( void ) {
	vec2 position = (gl_FragCoord.xy - resolution * .5) / resolution.yy;
	float th = atan(position.y, position.x) / (1.0 * 3.1415926);
	float dd = length(position) + 0.005;
	float d = 0.1 / dd + time;
    	vec2 x = gl_FragCoord.xy;
   	x=x*Scale*RR/RR.x;
    	x+sin(x.yx*sqrt(vec2(1,9)))/1.;
	x+=sin(x.yx*sqrt(vec2(73,5)))/5.;
    	x+=sin(x.yx*sqrt(vec2(93,7)))/3.;
	vec3 uv = vec3(th + d, th - d, th + sin(d) * 0.45);
	float a = 0.5 + cos(uv.x * 3.1415926 * 2.0) * 0.5;
	float b = 0.5 + cos(uv.y * 3.1415926 * 2.0) * 0.5;
	float c = 0.5 + cos(uv.z * 3.1415926 * 2.0) * 0.5;
	vec3 color = 	mix(vec3(1.0, 0.0, 0.0), 	vec3(0.0, 0.0, 0.0),  pow(a, 0.1)) * 1.5;
	color += 	mix(vec3(0.0, 0.0, 1.0), 	vec3(0.0, 0.0, 0.0),  pow(b, 0.1)) * 1.5;
	color *= dd;
	float xd = GetText(position);
	color = mix(vec3(1.1,1.1,0.1)+color,color,xd);
	gl_FragColor = vec4( (color), 1.0);
}