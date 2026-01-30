#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const int Iteration=1000;
float mbd(vec2 p) 
{
    float x, y, x0, y0, x_temp; 
    float dx, dy, dx_temp;
    float r, dr, dist;
    float escape;
	float Radius=10.0;
	
    
    //Initialize iteration variables
    escape = Radius*Radius;
	x0 = 0.0; y0 = 0.0;
    x0 = p.x; y0 = p.y;
    x = p.x; y = p.y;
    dx = 100.0; dy = 0.0;
    int O=0;
    //Run iterations
    for (int i = 0; i < Iteration; i++)
    {
        //Update z'
        dx_temp = 2.0*(x*dx - y*dy) + 1.0;
        dy = 2.0*(x*dy + y*dx);
        dx = dx_temp;
        
        //Update z
        x_temp = x*x - y*y + x0;
        y = 2.0*x*y + y0;
        x = x_temp;
        
        //If escaped, quit early
        if (x*x + y*y > escape) break;
        
        //If in a periodic orbit, assume it is trapped
        
	    O=i+1;
	    if (x == 0.0 && y == 0.0) break;//O=Iteration;
    }
    
    //Calculate distance
    r = sqrt(x*x + y*y);
    dr = sqrt(dx*dx + dy*dy);
    dist = 0.5*r*log(r)/dr;
    
    return dist;
}
float d(vec2 p){
	return mbd(p);//-0.001;//length(con)-2.0;
}

void main( void ) {

	float scale=2.0;
	vec2 position = ( (gl_FragCoord.xy-resolution.xy/2.0) / resolution.y )*scale*2.0;
	vec2 px=vec2(1.0)/resolution.y;
	float thickness=3.0;
	float thk=thickness*2.0*scale/sqrt(2.0);
	vec2 TL=position+vec2(-1.0,-1.0)/resolution.y*thk;
	vec2 TR=position+vec2(1.0,-1.0)/resolution.y*thk;
	vec2 BL=position+vec2(-1.0,1.0)/resolution.y*thk;
	vec2 BR=position+vec2(1.0,1.0)/resolution.y*thk;
	float TLv=d(TL);
	float TRv=d(TR);
	float BLv=d(BL);
	float BRv=d(BR);
		float minv=min(TLv,TRv);
	float cros=0.0;
	vec2 cent=vec2(0.0);
	if(TLv*TRv<0.0){
		cros=cros+1.0;
		vec2 nc=(TL*(abs(TRv))+TR*(abs(TLv)))/(abs(TLv)+abs(TRv));
		cent=(cent*(cros-1.0)+nc)/cros;		
	}
	if(TLv*BLv<0.0){
		cros=cros+1.0;
		vec2 nc=(TL*(abs(BLv))+BL*(abs(TLv)))/(abs(TLv)+abs(BLv));
		cent=(cent*(cros-1.0)+nc)/cros;
	}
	if(BLv*BRv<0.0){
		cros=cros+1.0;
		vec2 nc=(BL*(abs(BRv))+BR*(abs(BLv)))/(abs(BLv)+abs(BRv));
		cent=(cent*(cros-1.0)+nc)/cros;
	}
	if(TRv*BRv<0.0){
		cros=cros+1.0;
		vec2 nc=(TR*(abs(BRv))+BR*(abs(TRv)))/(abs(TRv)+abs(BRv));
		cent=(cent*(cros-1.0)+nc)/cros;
	}
	vec3 color=vec3(1.0,1.0,1.0);
	if(minv<0.0){
		color=vec3(0.7,0.7,1.0);
	}
	if(cros>0.0){
		float inter=max(min(thickness-length(cent-position)*resolution.y/2.0/scale,1.0),0.0);
	color=vec3(0.5,0.5,1.0)*inter+color*(1.0-inter);
	}
	

	gl_FragColor = vec4( abs(vec3(sin(1.0/(0.1+TLv)+1.0)/2.0+0.5,(sin(1.0/(0.1+TLv))/2.0+0.5),(cos(0.5/(0.1+TLv))/2.0+0.5)/1.0)), 1.0 );
}