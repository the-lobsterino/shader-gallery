// bpt.2017 thinkering

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// using as a starting point thx https://www.shadertoy.com/view/MtKSWt

vec4 BezierPoint(vec4 p0, vec4 p1, vec4 p2, float t){
    vec4 v1 = p1-p0;
    vec4 v2 = p2-p1;
    vec4 o0 = p0+v1*t;
    vec4 o1 = p1+v2*t;
    vec4 v3 = o1-o0;
    return v3*t+o0;
}

float dot2(vec4 v) {return dot(v,v);}

vec4 proj(vec4 v, vec4 w){
    return (dot(v,w)/dot(w,w)) * w;
    //return vec4(0,0,0,0);
}

float distFromLine(vec4 point, vec4 lineStart, vec4 lineEnd){
   vec2 dirStart = point.xy - lineStart.xy;
   vec2 dirEnd = point.xy - lineEnd.xy;
	if(dot(dirStart,dirEnd) > 0.0001){return 1.0;}
	
	
   vec2 lineDir = lineStart.xy - lineEnd.xy;
   vec2 dirPerp = vec2(lineDir.y,-lineDir.x);
   vec2 dirPoint = lineStart.xy - point.xy;
   return abs(dot(normalize(dirPerp),dirPoint));
}

float BezierLine(vec4 p, vec4 a, vec4 b, vec4 c,float minDist)
{	
	float minIter = 0.0;
    for( float i = 0.0; i <= 1.0; i+=0.0625)
    {
	vec4 t = BezierPoint(a,b,c,i);
	   float t2 = dot2(p-t);
	    if(t2 < minDist){minDist = t2; minIter = i;}
        //minDist = min( dot2(p-t), minDist);
	    if(distFromLine(p,a,t) < 0.003){return 1.0 ;}
	    if(distFromLine(p,c,t) < 0.003){return 1.0 ;}
	    
    }   
	
	if(pow(minDist,0.25) < 0.175){ return 1.0;}
	else { return 0.0;}
	//return 0.0;
}

void main( void )
{

    vec2 uv = (surfacePosition*vec2(2.0,2.0));
    vec4 p3 = vec2(1.,0.).xyxy;
	/*
	vec2 mousePos = mouse * vec2(4.0,2.0) - vec2(resolution.x* 0.002,resolution.y* 0.002);
	if(distance(uv, vec2(0.0,0.0)) < 0.1) {
		gl_FragColor = vec4(1,1,1,1);return;
	}
	
	if(distance(uv,mousePos) < 0.1){
		gl_FragColor =vec4(1,1,1,1);return;
	}
    	//else {gl_FragColor =vec4(0,0,0,0);return;}
	   if(distFromLine(vec4(surfacePosition,0,0),vec4(mousePos,0,0),vec4(0,0,0,0)) < 0.0125){
		   gl_FragColor = vec4(1,1,1,1);
		   return ;
	   }
	gl_FragColor =vec4(0,0,0,0);return; 
*/
//    vec4 p2 = vec4(0.0,sin(time)*uv.x,0.0,sin(time)*uv.x)*cos(time*2.0);//
    vec4 p2 = mouse.xyxy*2.0-1.0;
    vec4 p1 = -p3;
		
    gl_FragColor = vec4( vec3(
         BezierLine(vec4(uv,uv),p1,p2,p3,1.0)
    ),1.0);
}