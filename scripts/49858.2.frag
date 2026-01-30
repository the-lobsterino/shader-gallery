//this made by 834144373zhu;
//thank inigo quilez and his http://www.iquilezles.org/;
//but i use cg/hlsl and surfaceshader in unity,here i use the glsl to made ray-marching;
//and thank my english teacher who teach me the Chinglish.
//好吧，the language 我是装B装不下去了
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float udBox( vec3 p, vec3 b )
{
  return length(max(abs(p)-b,0.0));
}

float opU( float d1, float d2 )
{
    return min(d1,d2);
}
vec3 P2CameraSpace(in vec3 camPos,in vec3 p){
	vec3 dian = vec3(0,0,0);
	vec3 ArixY = vec3(0,1,0);
	vec3 z = normalize(dian - camPos);
	vec3 x = normalize(cross(z,ArixY));
	vec3 y = normalize(cross(z,x));

	vec3 theCameraSpaceP = vec3(
	//dot(p,x),dot(p,y),dot(p,z)
	p.x*x + p.y*y + p.z*z
	//mul(mat(x,y,z),p)
	//mul(p,mat(x,y,z))
				
	);

	return theCameraSpaceP;
}

float map(in vec3 pos){
	float d = sdSphere(pos,1.);
	d = opU(d,udBox(pos,vec3(0.3,1.,1.2)));
	return d;
}

vec3 normal(in vec3 pos){
	vec2 offset = vec2(0.001,0);
	vec3 nDir = normalize(
		vec3(
			map(pos+offset.xyy)-map(pos-offset.xyy),
			map(pos+offset.yxy)-map(pos-offset.yxy),
			map(pos+offset.yyx)-map(pos-offset.yyx)
		)
	);
	return nDir;
}

float marching(in vec3 orgin,in vec3 p){
	float t = 0.;
	//int i;
	for(int i=0;i<64;++i){
		vec3 sphere = orgin + t*p ;
		float d = map(sphere);
		if(d<0.02 || t>30.)break;
		t += d;
	}
	return t;
}

vec3 render(in vec3 pos,in vec3 p){
	float d = marching(pos,p);
	vec3 nDir = normal(pos + p*d);

	vec3 c = vec3(0.);
	if(d<30.){
		vec3 lDir = normalize(vec3(0.,1.,0.));
		float diff = max(0.,dot(lDir,nDir));

		c = nDir;//vec3(diff);
	}
	return c;
}
void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy )*2. - 1.;
	uv.x *= resolution.x/resolution.y;

	vec3 p = normalize(vec3(uv,2));

	// the Camera pos and move the Camera
	vec3 camPos = vec3(3.+sin(time),3.,3.+cos(time));
	// the new p direction
	vec3 theNewP = P2CameraSpace(camPos,p); 

	//render the models and light them
	vec3 col = render(camPos,theNewP);

	vec3 v = vec3(1,0.3,0.8)*sqrt(col.x+col.y+col.z);
	gl_FragColor = vec4( v, 1.0 );

}