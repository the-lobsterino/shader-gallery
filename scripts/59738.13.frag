// balls - 23/12/2019
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
float A(vec2 p,float d){d=LR(p,d);p.y=abs(p.y-1.5*CHS);return line2(d,p,vec4(2,1.75,-2,1.75)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));}
float L(vec2 p,float d){d=line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float S(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-0.25)*CHS);d=line2(d,p,vec4(-2,-0.25,2,-0.25)*CHS);return line2(d,p,vec4(2,-0.25,2,-3.25)*CHS);}// SHITRAG
 
float GetText(vec2 uv)
{
	float t = time;
	uv*=5.;
	uv.x = mod(uv.x+time*1.1,8.0)-4.5;
	uv.x += 2.25;
	uv.y += sin(uv.x*0.55+time*2.2)*0.55;
	float d;
	d = B(uv,1.0);uv.x -= 1.1;
	d = A(uv,d);uv.x -= 1.1;
	d = L(uv,d);uv.x -= 1.1;
	d = L(uv,d);uv.x -= 1.2;
	d = S(uv,d);
	d = smoothstep(0.,0.05,d-0.55*CHS);
	return d;
}
 
 
const float PI = acos(-1.);
float pMod1(inout float p, float size)
{
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize, size) - halfsize;
	return c;
}
float balls(vec3 p) {
	if (p.y>1.0)
		return 1000.0;
	float c2 = pMod1(p.x,1.5);
	float c = pMod1(p.z,1.5);
	c= abs(c)+1.;
	c2= abs(c2)+1.;
	p.y += 0.5+abs(sin(time+c*6.0*c2*12.0)*0.9);
	pMod1(p.y,3.5);
	float vv = 24.0+sin(c*c2)*16.;
	float a = 1.+time+c2*c;
	p.yz *= mat2(cos(a),-sin(a),sin(a),cos(a));
	a = atan(p.y,p.x);
	a -= floor(a*vv/(2.*PI)+.5)*(2.*PI)/vv;
	p.xy = length(p.xy)*vec2(cos(a),sin(a));	
	a = atan(p.x,p.z);
	//a += PI/vv;
	a -= floor(a*vv/(2.*PI)+.5)*(2.*PI)/vv;
	p.xz = length(p.xz)*vec2(cos(a),sin(a));	
	return p.x - .5;
}

vec3 normal(vec3 p) {
	vec2 d = vec2(1e-3,0);
	return normalize(vec3(balls(p+d.xyy),balls(p+d.yxy),balls(p+d.yyx))-balls(p));
}

vec3 raymarch(vec3 pos, vec3 dir) {
	for (int i = 0; i < 120; i++) {
		pos += dir * balls(pos);
	}
	return pos;
}
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {
	vec3 pos = vec3(0,0,-5);
	vec3 dir = normalize(vec3(  ( gl_FragCoord.xy - resolution.xy / 2. ) / resolution.x, 1));

	float angle = .2;
	mat3 rotate = mat3(cos(angle),-sin(angle),0,sin(angle),cos(angle),0,0,0,1);
	
	pos.yzx *= rotate;
	dir.yzx *= rotate;
	
	angle = time*0.4;
	rotate = mat3(cos(angle),-sin(angle),0,sin(angle),cos(angle),0,0,0,1);
	
	pos.zxy *= rotate;
	dir.zxy *= rotate;


	pos = raymarch(pos, dir);
	
	float dist = balls(pos);
	vec3 nor = normal(pos);
	
	vec3 pos2 = pos;
	float c2 = pMod1(pos2.x,1.5);
	float c = pMod1(pos2.z,1.5);
	c= abs(c)+1.;
	c2= abs(c2)+1.;
	vec3 col = hsv2rgb(vec3((c*10.0+c2)*0.02,0.75,0.6))*0.4;
	
        vec3 lin = vec3(0.0);
    	vec3  lig = normalize(vec3(0.7,0.875,0.89));		// dir
    	float dif = max(dot(nor,lig),0.0);
	lin += dif*vec3(4.00,4.00,4.00);
	float spec = pow(dif, 160.0) *0.7;
        lin += vec3(0.50,0.50,0.50);
        col = col*lin;
        col+=spec;
	col *= exp(-0.01*dist*dist);
	
	vec2 position = (gl_FragCoord.xy - resolution * .5) / resolution.yy;
	vec3 cc = sqrt(col);
	float xd = GetText(position);
	cc = mix(cc+vec3(0.4,0.3,0.2),cc,xd);
	
        float rf = sqrt(dot(position, position)) * 0.5;
        float rf2_1 = rf * rf + 1.0;
        float e = 1.0 / (rf2_1 * rf2_1);
	gl_FragColor = vec4(cc*e, 1.);
}