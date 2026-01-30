// bad news, Brexit won :(

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution

#define ROT(t) mat2(cos(t), sin(t), -sin(t), cos(t))
#define CHS 0.05
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float _R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT

float GetText(vec2 uv)
{
	float g = 0.3;
	float d = B(uv,4444.0);uv.x -= g;
	d = _R(uv,d);uv.x -= g;
	d = E(uv,d);uv.x -= g;
	d = X(uv,d);uv.x -= g;
	d = I(uv,d);uv.x -= g;
	d = T(uv,d);
	return d;
}

float smin(float a, float b, float k)
{
    float h = clamp(1.-abs((b-a)/k), 0., 2.);
    return min(a,b) - k*0.25*h*h*step(-1.,-h);
}

float map( vec3 p )
{
	float d = 5.5-length(p);
	d = smin(p.z+0.25,d,2.0);
	float t = 1.5*iTime;
	p.yx*=ROT(3.14+sin(fract(t*0.131)*6.28+p.z*.3)*3.141);
	p.z+=sin(sin(fract(p.y*0.4+time*0.5)*6.28))*0.15;
	float d2 = GetText(p.yz+vec2(0.7,-0.1))-0.02;
	vec2 e = vec2( d2, abs(p.x) - 0.1 );				// HAIRY AXE WOUND
	d2 = min(max(e.x,e.y),0.0) + length(max(e,0.0))-0.02;
	d2 = min(d,d2);
	return d2*0.8;
}

vec3 normal( vec3 p )
{
    vec2 e = 0.005 * vec2(1, -1);
    return normalize(
          e.xxx * map(p+e.xxx)
        + e.xyy * map(p+e.xyy)
        + e.yxy * map(p+e.yxy)
        + e.yyx * map(p+e.yyx)	// DICK
    );
}

float calcAO( in vec3 pos, in vec3 nor, float scale )
{
    float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float h = 0.01 + scale*0.12*float(i)/4.0;
        float d = map( pos + h*nor );
        occ += (h-d)/scale*sca;
        sca *= 0.95;
        if( occ>0.5 ) break;
    }
    return clamp( 1.0 - 2.0*occ, 0.0, 1.0 ) * (0.5+0.5*nor.z);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.0*fragCoord - iResolution.xy)/iResolution.y;
    float th = 0.0;
    float di = 2.5;	//+sin(time);
    vec3 ro = vec3(di*cos(th), di*sin(th), 0.0);
    vec3 camFwd = normalize(vec3(0.5,0,0) - ro);
    vec3 camRight = normalize(cross(camFwd, vec3(0,0,1)));
    vec3 camUp = cross(camRight, camFwd);
    float fov = 0.5;
    vec3 rd = (camFwd + fov * (uv.x * camRight + uv.y * camUp));
    rd = normalize(rd);
    
    float d, t=0.;
    for(int i=0; i<100; i++)	// MY CUNT
    {
        d = map(ro+t*rd);
        if(d < 0.001 || t > 100.) break;
        t += d;
    }
    vec3 p = ro+t*rd;
    vec3 col = vec3(0.0);		// FUCKHOLE
    if(t < 100.)
    {
	vec3 pos = ro + t*rd;
	vec3 nor = normal(p);
	vec3 dir = normalize(vec3(1.0,0.7,0.0));		// TWATTER
	vec3 ref = reflect(rd, nor);
	float spe = max(dot(ref, dir), 0.0);
	vec3 spec = vec3(1.0) * pow(spe, 10.);
	float dif = clamp( dot(nor,dir), 0.15, 1.0 );
	col =  vec3(0.3)*dif;
	col+=spec;
	float sca = clamp(length(p), 1.0, 10.0);
	col *= calcAO(p,nor,sca);
    }
    col *= smoothstep(2.5,1.0,length(uv));
    col = pow(col, vec3(1./2.2));
    fragColor = vec4(col, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}