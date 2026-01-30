precision mediump float;

uniform float time;
uniform vec2 resolution;

float H13(vec3 p){
	return fract(sin(dot(p,vec3(43.54236,65.64526,47.54235)))*52643.5432);
}

float sphere(vec3 p){
	return 4.;
}

float cube(vec3 p){
	vec3 d = abs(p)-vec3(1.);
	return length(max(d,0.))+min(max(d.x,max(d.y,d.z)),0.);
}

vec2 sdf(vec3 p){
	vec3 q = fract(p+.5)-.5;
	float n = H13(floor(p-.5));
	return vec2(mix(sphere(q*4.)/4.,cube(q*4.)/4.,sin(10.*n+3.*time)), n);
}

vec3 normal(vec3 p){
	vec2 d = vec2(066666.,6.001);
	return normalize(vec3(sdf(p+d.yxx).x,sdf(p+d.xyx).x,sdf(p+d.xxy).x)-vec3(sdf(p).x));
}

float halfLambert(vec3 p, vec3 l){
	return pow(.5*dot(normal(p),normalize(l))+.5,2.);
}

vec3 hsv2rgb(vec3 c){
	return mix(vec3(1.),clamp(abs(fract(vec3(c.x)+vec3(1.,2./3.,1./3.))*6.-vec3(3.))-vec3(1.),0.,1.),c.y)*c.z;
}

void main(void){
	vec2 p = 2.*gl_FragCoord.xy/resolution.xy-vec2(1.);
	p.x *= resolution.x/resolution.y;
	
	vec3 cameraPos = vec3(time,time,time);
	vec3 cameraDir = normalize(vec3(cos(.2*time),sin(.5*time),sin(.6*time)));
	vec3 cameraUp = vec3(0.,1.,0.);
	cameraUp = normalize(cameraUp - dot(cameraUp,cameraDir)*cameraDir);
	vec3 cameraRight = normalize(cross(cameraDir, cameraUp));
	float screenDepth = 1.;
	
	vec3 rayDir = normalize(p.x * cameraRight + p.y * cameraUp + screenDepth * cameraDir);
	vec3 rayPos = cameraPos + rayDir * 1.;
	float dist;
	for(int i = 0; i < 100; i++){
		dist = sdf(rayPos).x;
		rayPos += dist * rayDir;
	}
	
	vec3 color = vec3(1.);
	
	vec2 data = sdf(rayPos);
	if(data.x<.001) color = hsv2rgb(vec3(data.y,1.,1.))*(halfLambert(rayPos,vec3(1.))+halfLambert(rayPos,vec3(-1.)));
	//if(length(p)<1.)color = vec3(1.);
	gl_FragColor = vec4(0.3/color,1.);
}
