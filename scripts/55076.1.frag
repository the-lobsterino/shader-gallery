// Author: Inigo Quiles
// Title: Impulse

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
 
//  Function from Iñigo Quiles
//  www.iquilezles.org/www/articles/functions/functions.htm
float impulse(float x,float div ){
    return x*(1.-abs(cos(div)));
}

float plot(float st, float pct){
  return  smoothstep( pct-abs(st*0.25)-0.03, pct, st) -
          smoothstep( pct, pct+abs(st*0.25)+0.03, st);
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution;
	st-=0.5;
	float y,pct;
	vec3 color = vec3(y);;
    for(float i=0.17;i<=1.5708;i+=0.27)
	{
     y= impulse(st.x,i);
    pct = plot(st.y,y);
    color = (1.0-pct)*color+pct*vec3(1.0,1.0,0.0);
		
   y= impulse(st.y,i);
    pct = plot(st.x,y);
    color = (1.0-pct)*color+pct*vec3(1.0,1.0,0.0);	
		
	  y= impulse(-st.x,i);
    pct = plot(st.y,y);
    color = (1.0-pct)*color+pct*vec3(1.0,1.0,0.0);
		
   y= impulse(-st.y,i);
    pct = plot(st.x,y);
    color = (1.0-pct)*color+pct*vec3(1.0,1.0,0.0);	

	}	
    gl_FragColor = vec4(color,1.0);
}
