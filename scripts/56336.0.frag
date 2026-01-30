#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdSphere(vec3 p,float r){
	return length(p)-r;
}
float sdBox(vec3 p, float s) {
    p = abs(p) - s;
    return max(max(p.x, p.y), p.z);
}
vec3 rep(vec3 p,vec3 span){
	return mod(p,span)-span/2.;
}

#define rot(x) mat2(cos(x),-sin(x),sin(x),cos(x))

float distanceFunction(vec3 pos) {
	//pos+=sin(pos.z);
	//pos.xy*=mat2(cos(time),-sin(time),sin(time),cos(time));
    float d=sdBox(rep(pos,vec3(5,5,5)),1.);
    return d;
}

const int cnt = 200;

void main( void ) {
    vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);
 
    vec3 cameraPos = vec3(0., sin(time/6.), time*10.);
    float screenZ = 2.5;
    vec3 rayDirection = normalize(vec3(p, screenZ));
	
	rayDirection.xy*=rot(time/6.);
 
    float depth = 0.0;
	
	vec3 light=vec3(sin(time/0.7),cos(time*5.+sin(time)*3.)/5.,cameraPos.z+70.+cos(time/2.)*40.);
	vec3 lightCol=vec3(0.1,0.9,0.9);
 
    vec3 col = vec3(0.0);
 	vec3 rayPos;
	
    for (int i = 0; i < cnt; i++) {
        rayPos = cameraPos + rayDirection * depth;
        float dist = distanceFunction(rayPos);
 
        if (dist < 0.0001) {
            col = vec3(0.,0.5+sin(rayPos.z/20.)*0.2,1)*(1.-float(i)/float(cnt))/6.;
		
            break;
        }
 
        depth += dist;
    }
	
 
	float dd=dot(normalize(rayDirection),normalize(light-cameraPos));
	float lightDist=length(light-cameraPos)*tan(acos(dd));
	col+=lightCol*pow(lightDist,-0.5);
	col+=0.8*step(0.999,sin(-abs(length(light-rayPos))/100.+time*1.3));
    gl_FragColor = vec4(col, 1.0);
}
