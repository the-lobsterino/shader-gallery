// BREXIT
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAXDISTANCE 10000.
#define TRACKSVISIBLE 10
#define SEGMENTSPERTRACK 10
#define SECONDSPERTRACK 0.97
#define TRACKLENGTH 200.

float hash( float n ) {
	return fract(sin(n)*43758.5453);
}
float noise(in float x) {
	float p = floor(x);
	float f = fract(x);
		
	f = f*f*(3.0-2.0*f);	
	return mix( hash(p+  0.0), hash(p+  1.0),f);
}
float crossp( vec2 a, vec2 b ) { return a.x*b.y - a.y*b.x; }


void intersectSegment(const vec3 ro, const vec3 rd, const vec2 a, const vec2 b, out float dist, out float u) {
	dist = MAXDISTANCE;
	vec2 p = ro.yz;
	vec2 r = rd.yz;
	vec2 q = a-p;
	vec2 s = b-a;
	float rCrossS = crossp(r, s);
	
	if( rCrossS == 0.){
		return;
	}
	float t = crossp(q, s) / rCrossS;
	u = crossp(q, r) / rCrossS;
	
	if(0. <= t && 0. <= u && u <= 1.){
		dist = t;
	}
}

float trackAngle( float s ) {
	return (2.*noise( s*0.1 )-1.)*2.;
}
float trackHeight( float s ) {
	return 500.*noise( s*0.2 );
}

float traceTrack( vec3 ro, vec3 rd, out vec2 texcoord ) {
	float dist = MAXDISTANCE, dtest, xdist, zdist = MAXDISTANCE;
	float utest;
	
	float tf = time / SECONDSPERTRACK;
	float starttrack = floor(tf);
	float fracttrack = fract(tf);
	
	float z = -fracttrack*TRACKLENGTH;
	
	float sa = trackAngle( tf );
		
	for( int it=0; it<TRACKSVISIBLE; it++) {
		float t = float(it)+starttrack;
			
		for( int is=0; is<SEGMENTSPERTRACK; is++ ) {			
			float dt = float(is)/float(SEGMENTSPERTRACK);
			intersectSegment( ro, rd, vec2( trackHeight( t+dt ), z ), 
							 vec2( trackHeight( t+dt+(1./float(SEGMENTSPERTRACK)) ), z+(TRACKLENGTH/float(SEGMENTSPERTRACK))), dtest, utest );
			if( dtest < dist ) {
				dist = dtest;
				texcoord.y = utest;
				xdist = ro.x+rd.x*dist;
				zdist = ro.z+rd.z*dist;
				texcoord.x = xdist + 2.*zdist*sin( trackAngle(t+dt+(utest/float(SEGMENTSPERTRACK)))-sa );
			}
			z+=(TRACKLENGTH/float(SEGMENTSPERTRACK));
		}
	}
	return zdist;
}

vec3 trackColor( vec2 texcoord ) {
	if( abs(texcoord.x)<50. ) { // road
		if(texcoord.y>0.5) {
			return abs(texcoord.x)>46.?vec3(1.):vec3( 146./255. );
		} else {
			return mod(texcoord.x, 22.)<1.5?vec3(1.):vec3( 154./255. );
		}
	} else { // desert
		return (texcoord.y>0.5)?vec3( 135./255., 249./255., 63./255. )
			:vec3( 137./255., 221./255., 65./255. );
	}
}
vec3 skyColor( vec2 texcoord ) {
	vec3 col = vec3( 140./255., 66./255., 85./255.);
	float n = noise( texcoord.x )*texcoord.y*10.+texcoord.y*4.;
	n += noise( texcoord.x * 10. );
	if( n < 1. ) col = mix(
		vec3( 170./255., 154./255., 138./255.),
		vec3( 235./255., 219./255., 203./255. ), clamp(texcoord.y*16., 0., 1.) );
	return col;
}

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
void main()
{
	vec2 q = gl_FragCoord.xy/resolution.xy;
	vec2 p = -1.0+2.0*q;
	p.x *= resolution.x/resolution.y;

	vec3 ro = vec3( -20.*sin(trackAngle(time/SECONDSPERTRACK)), 10.+trackHeight(time/SECONDSPERTRACK), -14. );
	vec3 rd = normalize( vec3( p, 1. ) );	
	vec3 color = vec3( 0. );
	
	vec2 texcoord;
	float d =  traceTrack( ro, rd, texcoord );
	if( d < MAXDISTANCE ) {
		color = mix( trackColor( texcoord ), vec3( 170./255., 154./255., 138./255.), d/(float(TRACKSVISIBLE)*TRACKLENGTH));
	} else {
		if( rd.y > 0. ) {
			color = skyColor( vec2( p.x-2.*trackAngle(time/SECONDSPERTRACK), p.y) );
		} else {
			color = vec3( 170./255., 154./255., 138./255.);
		}
	}
	
	color = clamp(color, 0., 1.)	;
	
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	uv.y += abs(sin(time+uv.x)*0.2);
	float dd= GetText(uv*2.0);
	color = mix(color+vec3(.5,0.4,1.9), color,dd);
	
	
	gl_FragColor = vec4( clamp(color, 0., 1.),1.0);
}