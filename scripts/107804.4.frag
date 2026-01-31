#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ENABLE_OPTIMIZATION

#define PI 3.141592653589793

float ellIntersect( in vec3 ro, in vec3 rd, vec3 c, float outerRadius )
{	
	float t = (c.y - ro.y) / rd.y;
	vec2 q = (c - (ro + rd * t)).xz;
	float l = dot(q, q);
	
	if(l > 1.0 || l < outerRadius * outerRadius) return -1.0;
	
	return t;
}


vec4 tubeIntersect( in vec3 ro, in vec3 rd, in vec3 a, in vec3 b, float ra )
{
    float ir = 0.75;
    vec3 oa = b - vec3(0.0, 0.5, 0.0);

    // Outer cylinder
    vec3  ba = vec3(0.0, 0.5, 0.0);
    vec3  oc = ro - oa;
    float baba = 0.25;
    float bard = rd.y * 0.5;
    float baoc = oc.y * 0.5;
    float k2 = baba            - bard*bard;
    float k1 = baba*dot(oc,rd) - baoc*bard;
    float k0 = baba*dot(oc,oc) - baoc*baoc - ra*ra*baba;
    float h = k1*k1 - k2*k0;

    // Inner cylinder
    vec3  iba = b  - a;
    vec3  ioc = ro - a;
    float ibaba = dot(iba,iba);
    float ibard = dot(iba,rd);
    float ibaoc = dot(iba,ioc);
    float ik2 = ibaba            - ibard*ibard;
    float ik1 = ibaba*dot(ioc,rd) - ibaoc*ibard;
    float ik0 = ibaba*dot(ioc,ioc) - ibaoc*ibaoc - ra*ra*ibaba * ir * ir;
    float ih = ik1*ik1 - ik2*ik0;

    float oh = ik1 * ik1 - ik2 * ik0;
    if( h<0.0 ) return vec4(-1.0);//no intersection
    h = sqrt(h);
    float t1 = (-k1-h)/k2;
    float t2 = oh > 0.0 ? (-ik1-sqrt(oh))/ik2 : -1.0;
    float t3 = oh > 0.0 ? (-ik1+sqrt(oh))/ik2 : -1.0;

    // body
    float y1 = baoc + t1*bard;
    float y2 = ibaoc + t2*ibard;
    float sig = 1.0;
	
    if(y2 > ibaba || y2 < 0.0) {
	t2 = t3;
        y2 = ibaoc + t3*ibard;
	sig = -1.0;
    }
	
    if( y1>0.0 && y1<baba && t1 > 0.0 ) return vec4( t1, (oc+t1*rd - ba*y1/baba)/ra );

    float frontEll = ellIntersect(ro, rd, b, ir);
    float backEll = -1.0; // ellIntersect(ro, rd, oa, ir);
	
    bool isBackCylDefined = t2 > 0.0 && y2 < ibaba && y2 > 0.0;

    if(frontEll > 0.0 && (frontEll < t2 || !isBackCylDefined) && (frontEll < backEll || backEll < 0.0)) return vec4(frontEll, vec3(0.0, 1.0, 0.0));
    if(backEll > 0.0 && (backEll < t2 || !isBackCylDefined)) return vec4(backEll, vec3(0.0, -1.0, 0.0));
    if(isBackCylDefined) return vec4( t2, (ioc+t2*rd - iba*y2/ibaba)/(ra * ir * sig) );

    return vec4(-1.0);//no intersection
}

mat3 rotation(vec3 angles) {
	float sinA = sin(angles.x), cosA = cos(angles.x);
	float sinB = sin(angles.y), cosB = cos(angles.y);
	float sinY = sin(angles.z), cosY = cos(angles.z);
	
	return mat3(vec3(cosB * cosY, sinA * sinB * cosY - cosA * sinY, cosA * sinB * cosY + sinA * sinY),
		    vec3(cosB * sinY, sinA * sinB * sinY + cosA * cosY, cosA * sinB * sinY - sinA * cosY),
		    vec3(-sinB, sinA * cosB, cosA * cosB));
}

vec2 sphIntersect( in vec3 ro, in vec3 rd, in vec3 ce )
{
    vec3 oc = ro - ce;
    float b = dot( oc, rd );
    float c = dot( oc, oc ) - 1.0;
    float h = b*b - c;
    if( h<0.0 ) return vec2(-1.0); // no intersection
    return vec2( 1.0 );
}

vec3 scene(vec3 ro, vec3 rd) {
	const float space = 4.;
	const vec3 fogColor = vec3(0.1, 0.1, 0.12) * 1.2;
	
	if(rd.y > 0.0) return fogColor;
	
	for(int y = 1; y < 15; y++) {
		for(int x = -8; x <= 8; x++) {
			if((x < 0 && rd.x > 0.0) || (x > 0 && rd.x < 0.0))
				continue;
			
			int z = y + int(ro.z / space);
			
			vec3 pos = vec3(float(x) * space, 0.0, float(z) * space);
			
			#ifdef ENABLE_OPTIMIZATION
			if(sphIntersect(ro * vec3(1., 0., 1.), normalize(rd * vec3(1., 0., 1.)), pos).x < 0.0)
				continue;
			#endif
			
			float height = sin(float(x) + time) + cos(float(z) - time);
			
			vec4 cyl = tubeIntersect(ro, rd, vec3(float(x) * space, -100.0, float(z) * space), vec3(float(x) * space, height, float(z) * space), 1.0);

			if(cyl.x > 0.0) {
				vec3 dir = vec3(float(x) * space, height, float(z) * space - 10.0) - ro;
				float light = max(0.03, dot(normalize(-dir), cyl.yzw) / length(dir) * 2.5);
				return mix(mix(vec3(0.3, 0.5, 0.7), vec3(1.0, 0.0, 0.0), sin(time) * 0.5 + 0.5) * light * 0.2, fogColor, min(pow(cyl.x, 0.5) / 7.0, 1.0));
			}
		
		}
	}
	
	return fogColor;
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy - resolution.xy * 0.5 ) / min(resolution.x, resolution.y);
	
	float vignette = pow(clamp(1.7 - length(position), 0.0, 1.0), 2.0);
	
	vec3 rd = normalize(vec3(position, 1.0));
	vec3 ro = vec3(cos(time) * 1.0 + 1.0, 7.0 + sin(time * 0.3) * 2.0 - 2.0, -5.0 + time * 20.0);
	
	mat3 rot = rotation(vec3((cos(time * 0.5) * 0.5 + 0.5) * 30., 0.0, sin(time * 0.6) * 45.0) / 180.0 * PI);

	rd *= rot;
	
	vec3 color = scene(ro, rd);

	gl_FragColor = vec4( color, vignette );

}