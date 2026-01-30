// BREXIT
#ifdef GL_ES
precision highp float;
#endif
uniform float time;
uniform vec2 resolution;
 #define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT

float GetText(vec2 uv)
{
	uv.y -= 0.4;
	uv.x += 2.75;
	float d = B(uv,1.0);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = X(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = T(uv,d);
	return smoothstep(0.0,0.05,d-0.55*CHS);
}
mat2 m = mat2( 0.90,  0.110, -0.70,  1.00 );
 
float ha( float n ) {return fract(sin(n)*758.5453);}
 
float no( in vec3 x )
{    vec3 p = floor(x);    vec3 f = fract(x); 
    float n = p.x + p.y*57.0 + p.z*800.0;float res = mix(mix(mix( ha(n+  0.0), ha(n+  1.0),f.x), mix( ha(n+ 57.0), ha(n+ 58.0),f.x),f.y),
    mix(mix( ha(n+800.0), ha(n+801.0),f.x), mix( ha(n+857.0), ha(n+858.0),f.x),f.y),f.z);
    return res;}
 
float fbm( vec3 p )
{    float f = 0.0;
    f += 0.50000*no( p ); p = p*2.02;    f -= 0.25000*no( p ); p = p*2.03;
    f += 0.12500*no( p ); p = p*2.01;    f += 0.06250*no( p ); p = p*2.04;
    f -= 0.03125*no( p );    return f/0.984375;}
 
float cloud(vec3 p)
{	p-=fbm(vec3(p.x,p.y,0.0)*0.5)*2.25;float a =0.0;	a-=fbm(p*3.0)*2.2-1.1;
	if (a<0.0) a=0.0;a=a*a;	return a;}
 
vec3 f2(vec3 c)
{	c+=ha(gl_FragCoord.x+gl_FragCoord.y*9.9)*0.01;
	c*=0.7-length(gl_FragCoord.xy / resolution.xy -0.5)*0.7;
	float w=length(c);
	c=mix(c*vec3(1.0,1.0,1.6),vec3(w,w,w)*vec3(1.4,1.2,1.0),w*1.1-0.2);
	return c;}
void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;
	position.y+=0.2;	vec2 coord= vec2((position.x-0.5)/position.y,1.0/(position.y+0.2));
	coord+=time*0.1;	float q = cloud(vec3(coord*1.0,0.222));
vec3 	col =vec3(0.2,0.4,0.5) + vec3(q*vec3(0.2,0.4,0.1));
	col = f2(col);
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	uv.y += 0.15+(sin(time+col.g*0.1+uv.x*sin(time*1.5+uv.y*2.0))*0.2);
	uv.x += sin(col.r*0.2+uv.y*0.5);
	float dd= GetText(uv*2.25);
	col = mix(col+vec3(.6*0.3+uv.y,.3,-.1), col,dd);
	
	
	gl_FragColor = vec4( col, 1.0 );}
