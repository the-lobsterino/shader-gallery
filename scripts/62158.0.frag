precision mediump float;
uniform vec2 resolution;

#define SR3 1.73205080757
#define HEX vec2(1, 1.73205080757)

vec2 hexcenter1( in vec2 p ) {
    vec2 centerA = (floor(p.xy*HEX)+0.5)/HEX;
    vec2 centerB = (floor((p.xy+HEX*0.5)*HEX)+0.5)/HEX-HEX*0.5;
    vec2 a = p.xy-centerA.xy; vec2 b = p.xy-centerB.xy;
    return dot(a,a)<dot(b,b) ? centerA : centerB;
}

vec2 hexcenterA( in vec2 p ) {
    vec2 centerA = (floor(p.xy*HEX)+0.5)/HEX;
    return centerA;
}

vec2 hexcenterB( in vec2 p ) {
    vec2 centerB = (floor((p.xy+HEX*0.5)*HEX)+0.5)/HEX-HEX*0.5;
    return centerB;
}

void main( void ) {
	vec2 p = (2.*gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);
	vec3 color = vec3(0.);
	
	p *= 1.;
	
	color.rg = .5*(p - hexcenter1(p))+.5;
	
	if(distance(p,hexcenterA(p))<.05)color.r = 1.;
	if(distance(p,hexcenterB(p))<.05)color.g = 1.;
	
	gl_FragColor = vec4(color,1.);
}