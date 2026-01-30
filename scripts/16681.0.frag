// By @paulofalcao
//
// Blobs

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float makePoint(float x,float y,float fx,float fy,float sx,float sy,float t){
   float xx=x+sin(t*fx)*sx;
   float yy=y+cos(t*fy)*sy;
   return 1.0/sqrt(xx*xx*yy*yy)/(100.);
}
float sin01(float f) {
	return sin(f)*0.5+0.5;
}
void main( void ) {

   vec2 p=(gl_FragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);

   p=p*2.0;
   
   float x=p.x;
   float y=p.y;
const float count = 10.0;
	vec3 c = vec3(0);
	for (float i=1.0; i<=count;i+=1.0) {
		float d=makePoint(x,y,i*0.3,i*0.3,i*0.2,i*0.2,time);
		c+=vec3(sin01(i*d)/count,sin01(i*d*5.0)/count,sin01(i*d*10.0)/count);
	}
   
   gl_FragColor = vec4(c,1.0);
}