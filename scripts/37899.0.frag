
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D ack;

const float amount = -0.2;

float makePoint(float x,float y,float fx,float fy,float sx,float sy,float t){
   float xx = x + tan(t*fx)*sx;
   float yy = y;// +tan(t*fy)*sy;
   //return ;
   float temp = xx * yy;
   if (temp == 0.0)
   {
	temp = 0.000001;
   }
   return 1.0 / length(temp);
}

void main( void )
{
	vec2 p=(gl_FragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);
	
	p = p * 10.0;
    
	float x = p.x;
	float y = p.y;
	float angle = atan(x, y);
	float radius = length(p);
	float ph = radius * cos(amount + 0.01 * time)/9.+time;
	

	float a = makePoint(x,y,1.3,0.9,0.3,-0.3,ph*1.1);
	float b = makePoint(x,y,1.3,0.3,0.3,0.3,ph*-1.2);
	float c = makePoint(x,y,1.1,0.9,0.6,-0.8,(ph*ph-time*time)*1.3*cos(time/33.));
       
	vec2 shifted = cos(radius * vec2(sin(angle), sin(angle)));
  	vec4 bb = texture2D(ack, shifted);
	gl_FragColor = vec4(a, b, c, 1.0) - bb;
}