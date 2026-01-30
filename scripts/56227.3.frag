#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
#define rotate(x) mat2(cos(x),-sin(x),sin(x),cos(x))
#define PI acos(0.)

vec3 light;
float lightDist=pow(2.,15.);

vec3 rep(vec3 p,vec3 span){
	return mod(p,span)-span*0.5;
}
float cylinder_y(vec3 p, vec3 c)
{
    return length(p.xz + vec2(c.z, 0) - vec2(c.x, 0)) - c.z;
}
float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return length(max(d,0.0))+ min(max(d.x,max(d.y,d.z)),0.0);
}
float sdSphere(vec3 p,float r){
	return length(p)-r;
}

float distanceFunction(vec3 pos) {
    float d = sdBox(rep(pos,vec3(8.,10,4)),vec3(1.5));
	vec3 cyPos=pos;
	float dd=sdSphere(pos-light,0.2);
	//lightDist=min(lightDist,dd);
	d=min(d,dd);
	
	//cyPos.xy*=rotate(time);
	//d=min(d,cylinder_y(rep(cyPos,vec3(20)),vec3(0.2)));
    return d;
}
vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        distanceFunction(p + vec3(  d, 0.0, 0.0)) - distanceFunction(p + vec3( -d, 0.0, 0.0)),
        distanceFunction(p + vec3(0.0,   d, 0.0)) - distanceFunction(p + vec3(0.0,  -d, 0.0)),
        distanceFunction(p + vec3(0.0, 0.0,   d)) - distanceFunction(p + vec3(0.0, 0.0,  -d))
    ));
}
void main( void ) {
    vec2 p = ( gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);

    vec3 cameraPos = vec3(0., 1.5, 0.+time*2.);
    float screenZ = 5.;
    vec3 rayDirection = normalize(vec3(p, screenZ));
	rayDirection.yx*=rotate(PI/6.);

	light=vec3(0,0,cameraPos.z)+vec3(0,0,40.+tan(time/10.)*20.);
	vec3 lightCol=vec3(0.1,0.6,0.8);
	float dd=dot(normalize(rayDirection),normalize(light-cameraPos));
	lightDist=length(light-cameraPos)*tan(acos(dd));
	
	vec3 col=vec3(0);
    float depth = 0.0;
    for (int i = 0; i < 100; i++) {
        vec3 rayPos = cameraPos + rayDirection * depth;
        float dist = distanceFunction(rayPos);
	    if(dist<0.0001){
		    col=vec3(0.);
		    //col=vec3(1)*(1.-float(i)/100.) ;
		    col+=lightCol*pow(length(rayPos-light),-0.5);
		    col+=lightCol*step(length(light-cameraPos),length(rayPos))*0.3;
		    col+=lightCol/1.*dot(getNormal(rayPos),normalize(light-rayPos));
		    break;
	    }
        depth += dist;
    }

	col+=lightCol*pow(lightDist,-1.)*clamp(dd,0.,1.);
    gl_FragColor = vec4(col, 1.0);
}